'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { camelCaseToTitleCase, formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';

interface Props {
  order: Order;
}
const OrderDetailsTable = ({ order }: Props) => {
  const {
    id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    orderitems,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Details</h2>
              <div className="flex gap-2">
                <span className="font-bold">Payment Method: </span>
                <p>{camelCaseToTitleCase(paymentMethod)}</p>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="font-bold">Payment Status: </span>
                {isPaid ? (
                  <Badge variant={'secondary'}>
                    Paid on {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant={'destructive'}>Unpaid</Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl pb-4">Delivery Details</h2>
              <div>
                <h3 className="font-bold text-xl">Shipping Address</h3>
                <p>{shippingAddress.fullName}</p>
                <address>
                  {shippingAddress.streetAddress}
                  <br />
                  <span className="mr-1">{shippingAddress.city}, </span>
                  <span className="mr-1">{shippingAddress.state},</span>
                  <span className="mr-1">{shippingAddress.postalCode}</span>
                  <span>{shippingAddress.country}</span>
                </address>
              </div>
              <div>
                <div className="flex gap-2 mt-1">
                  <span className="font-bold">Delivery Status: </span>
                  {isDelivered ? (
                    <Badge variant={'secondary'}>
                      Delivered on {formatDateTime(deliveredAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant={'destructive'}>Not Delivered</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems &&
                    orderitems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded-lg"
                            />
                            <span>{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
