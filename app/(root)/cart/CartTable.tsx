'use client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { formatCurrency } from '@/lib/utils';
import { ArrowBigRight, Loader2Icon, MinusIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Cart } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  cart?: Cart;
}

const CartTable = ({ cart }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty.
          <Button className="ml-2" variant={'outline'}>
            <Link href={'/'}>Start Shopping</Link>
          </Button>{' '}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item, index) => (
                  <TableRow key={index}>
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
                          className="rounded-lg"
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant={'outline'}
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId
                            );
                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                title: 'Error Removing from Cart',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <MinusIcon className="h-4 w-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        variant={'outline'}
                        onClick={() => startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                                toast({
                                  variant: 'destructive',
                                  title: 'Error adding to Cart',
                                  description: res.message,
                                });
                            }
                        })}
                      >
                        {isPending ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <PlusIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
                <div className="pb-3 text-xl">Subtotal ({cart.items.reduce((a,c) => a + c.qty, 0)} items): 
                    <span className='font-bold'>
                        {formatCurrency(cart.itemsPrice)}
                    </span>
                </div>
                <Button className='w-full' disabled={isPending} onClick={() => startTransition(() => router.push('/shipping-address'))}>
                    {isPending ? (<Loader2Icon className="h-4 w-4 animate-spin" />) : (<ArrowBigRight className="h-4 w-4" />)}
                    Proceed to Checkout
                </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
