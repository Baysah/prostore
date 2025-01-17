/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../schemas';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

//calculate prices
const calPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10); //shipping is $10 if price is less than $100
  const taxPrice = round2(itemsPrice * 0.07); //7% tax
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

//Add item to cart
export const addItemToCart = async (data: CartItem) => {
  try {
    //check for session cart id
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    //check if session cart id is null
    if (!sessionCartId) {
      throw new Error('Session Cart Id not found');
    }

    //get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get Cart
    const cart = await getMyCart();

    //parse and validate item
    const item = cartItemSchema.parse(data);

    //find product in db
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (!cart) {
      //create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        sessionCartId: sessionCartId,
        items: [item],
        ...calPrice([item]),
      });

      //insert cart into db
      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate product Page
      revalidatePath(`/product/${item.slug}`);

      return {
        success: true,
        message: `${item.name} added to cart`,
      };
    } else {
      //check if product is already in cart
      const existingCartItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existingCartItem) {
        //check the stock
        if (product.stock < existingCartItem.qty + 1) {
          throw new Error('Not enough in stock');
        }
        //increase quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existingCartItem.qty + 1;
      } else {
        //if Product does not exist in cart
        //check stock
        if (product.stock < 1) throw new Error('Not enough in stock');
        //add product to cart
        cart.items.push(item);
      }
      //Save to Database
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${item.slug}`);
      return {
        success: true,
        message: `${item.name} ${
          existingCartItem ? 'updated in' : 'added to'
        }  cart`,
      };
    }

    return {
      success: true,
      message: 'Item added to cart',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getMyCart = async () => {
  //check for session cart id
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  //check if session cart id is null
  if (!sessionCartId) {
    throw new Error('Session Cart Id not found');
  }

  //get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //get user cart from db
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;

  //convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
};

export const removeItemFromCart = async (productId: string) => {
  try {
    //check for session cart id
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    //check if session cart id is null
    if (!sessionCartId) {
      throw new Error('Session Cart Id not found');
    }
    //get the Product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error('Product not found');

    //get the user's cart
    const cart = await getMyCart();
    if(!cart) throw new Error('Cart not found');

    //check if cart has item
    const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
    if(!exist) throw new Error('Item not found');

    //Check if only one in new quantity
    if(exist.qty === 1){
      //remove item from cart
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
    } else{
      //Decrease the qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty - 1;
    }

    //update cart in db
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calPrice(cart.items as CartItem[])
      },
    })

    revalidatePath(`/product/${product.slug}`)

    return {
      success : true,
      message: `${product.name} was removed from the cart`
    }

  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
