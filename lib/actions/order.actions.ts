'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../schemas';
import { prisma } from '@/db/prisma';
import { CartItem, PaymentResult } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { ORDER_PER_PAGE } from '../constants';
import { Prisma } from '@prisma/client';



// create a new order && create the order items
export const createOrder = async () => {
  try {
    //verify user has been authenticated
    const session = await auth();
    if (!session) throw new Error('user is not authenticated');

    //get the user's cart
    const cart = await getMyCart();

    //get user id
    const userId = session?.user?.id;
    if (!userId) throw new Error('user not found');

    //fetch user from db
    const user = await getUserById(userId);

    //check if user has items in cart, address and payment method
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Cart is empty',
        redirectTo: '/cart',
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: 'No Shipping Address Found',
        redirectTo: '/shipping-address',
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'No Payment Method Selected',
        redirectTo: '/payment-method',
      };
    }

    //create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error('Order not created');

    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//fetch the order by ID
export const getOrderById = async (orderId: string) => {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
};

//Create new paypal Order
export const createPayPalOrder = async (orderId: string) => {
  try {
    //get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      //create new PayPal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
      //update the order with PayPal order Id
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            statud: '',
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: 'Item Order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//Approve paypal order and update order status
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment');
    }

    // Update order to paid
    await updateOrderStatus({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update order status
const updateOrderStatus = async ({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) => {
  //Get order from db
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error('Order not found');

  if (order.isPaid) {
    throw new Error('Order is already paid');
  }

  //Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    //Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      });
    }
    //update order status to paid
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResult,
      },
    });
  });
  //Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');
};

//fetch user orders
export const getMyOrders = async ({
  limit = ORDER_PER_PAGE,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  //get session
  const session = await auth();

  if (!session) throw new Error('User not authenticated');

  const userId = session?.user?.id;

  const data = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: {
      userId: userId,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

type SalesDataType = {
  month: string;
  totalSales: number;
}[]

//get sales data and order summary
export const getOrderSummary = async() => {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get all orders
export const getAllOrders = async({
  limit = ORDER_PER_PAGE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) => {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//Delete an order
export const deleteAnOrder = async (id: string) => {
  try {
    await prisma.order.delete({
      where: {
        id: id
      }
    });

    revalidatePath('/admin/orders');

    return {success: true, message: 'Order deleted successfully'}
  } catch (error) {
    return {success: false, message: formatError(error)}
  }
}

//Update Delivery Status
export const markOrderAsDelivered = async (orderId: string) => {
try {
  //check if the order exists
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
  });

  if (!order) throw new Error('Order not found');

  if (order.isDelivered) {
    throw new Error('Order is already delivered');
  }

  //update the order delivered status
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      isDelivered: true,
      deliveredAt: new Date(),
    },
  });
  revalidatePath(`/order/${orderId}`)
  return {
    success: true,
    message: 'Order updated successfully',
  }
} catch (error) {
  return {
    success: false,
    message: formatError(error),
  }
}
}

//Update Payment Status
export const markOrderAsPaid = async (orderId: string) => {
  try {

    //check if the order exists
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    //check if the order is already paid
    if (order.isPaid) {
      throw new Error('Order is already paid');
    }

    //update the order payment status
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      }
    })
    revalidatePath(`/order/${orderId}`)
    return {
      success: true,
      message: 'Order updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}