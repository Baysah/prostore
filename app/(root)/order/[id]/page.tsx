import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./orderDetailsTable";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";


export const metadata: Metadata = {
  title: 'Order Details',
};

interface Props {
    params: Promise<{
        id: string;
    }>;
}

const OrderDetailsPage = async({ params }: Props) => {

  const session = await auth();
  

    //get the order id from the url
    const { id } = await params;

    //fetch the order from the database
    const order = await getOrderById(id);

    //verify that the order exists
    if(!order) notFound();

    return (
      <>
        <OrderDetailsTable
          order={{
            ...order,
            shippingAddress: order.shippingAddress as ShippingAddress,
          }}
          paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
          isAdmin={session?.user?.role === 'admin' || false}
        />
      </>
    );
}
 
export default OrderDetailsPage;