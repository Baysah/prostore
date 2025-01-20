import { auth } from "@/auth";
import CheckOutSteps from "@/components/shared/checkout/CheckOutSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { camelCaseToTitleCase, formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./PlaceOrderForm";

export const metadata: Metadata = {
  title: 'Place Order',
}

const PlaceOrderPage = async() => {
  const cart = await getMyCart();
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId)

  if(!cart || cart.items.length === 0) redirect('/cart');
  if(!user.address) redirect('/shipping-address');
  if(!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress

    return (
      <>
        <CheckOutSteps current={3} />
        <h1 className="py-4 text-2xl">Place Order</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
          <div className="md:col-span-2 overflow-x-auto space-y-4">
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Order Items</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              priority={true}
                              className="rounded-md"
                            />
                            <span className="px-2">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="px-2">{item.qty}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3">
                  <Button asChild size={'sm'} variant={'outline'}>
                    <Link href={'/cart'}>Edit Cart</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Shipping Address</h2>
                <p>{userAddress.fullName}</p>
                <address>
                  <div>{userAddress.streetAddress}</div>
                  <div>
                    {userAddress.city}, {userAddress.state}{' '}
                    {userAddress.postalCode}
                  </div>
                  <div>{userAddress.country}</div>
                </address>
                <div className="mt-3">
                  <Button asChild size={'sm'} variant={'outline'}>
                    <Link href={'/shipping-address'}>Edit Address</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 gap-4">
                <h2 className="text-xl pb-4">Payment Method</h2>
                <p>{camelCaseToTitleCase(user.paymentMethod)}</p>
                <div className="mt-3">
                  <Button asChild size={'sm'} variant={'outline'}>
                    <Link href={'/payment-method'}>
                      Edit Default Payment Method
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-4 gap-4 space-y-4">
                <div className="flex justify-between">
                  <div>Items</div>
                  <div>{formatCurrency(cart.itemsPrice)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Tax</div>
                  <div>{formatCurrency(cart.taxPrice)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Shipping</div>
                  <div>{formatCurrency(cart.shippingPrice)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Total</div>
                  <div>{formatCurrency(cart.totalPrice)}</div>
                </div>
                <PlaceOrderForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
}
 
export default PlaceOrderPage;