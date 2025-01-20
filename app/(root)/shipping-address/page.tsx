import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './ShippingAddressForm';
import CheckOutSteps from '@/components/shared/checkout/CheckOutSteps';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  //get the cart
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User not found');
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  return (
    <>
      <CheckOutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
