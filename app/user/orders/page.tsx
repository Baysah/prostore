import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/shared/pagination';

export const metadata: Metadata = {
  title: 'Orders History',
};

const OrdersHistoryPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;
  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

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
                  <Link
                    href={`/order/${order.id}`}
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                  >
                    <span>View Order</span>
                  </Link>
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

export default OrdersHistoryPage;
