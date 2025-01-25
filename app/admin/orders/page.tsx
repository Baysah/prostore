import { auth } from '@/auth';
import DeleteDialog from '@/components/shared/DeleteDialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteAnOrder, getAllOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Order History',
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page = '1' } = await props.searchParams;
  const session = await auth();
  const orders = await getAllOrders({
    page: Number(page),
    query: 'all',
  });

  if (session?.user.role !== 'admin') {
    return (
      <div className="flex">
        <h1>Not Authorized</h1>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders History</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="uppercase">
              <TableHead>Order Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Badge>Paid</Badge>
                  ) : (
                    <Badge variant={'destructive'}>Unpaid</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered ? (
                    <Badge>
                      Delivered on {formatDateTime(order.deliveredAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant={'destructive'}>Not Delivered</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant={'outline'} size={'sm'}>
                    <Link
                      href={`/order/${order.id}`}
                      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    >
                      <span>View Order</span>
                    </Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteAnOrder} title='Order' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
