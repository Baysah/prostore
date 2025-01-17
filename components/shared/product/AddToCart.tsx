/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';

interface Props {
  item: CartItem;
}

const AddToCart = ({ item }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({
        variant: 'destructive',
        title: 'Error Adding to Cart',
        description: res.message,
      });
      return;
    }

    //handle success
    toast({
      variant: 'default',
      title: 'Added to Cart',
      description: `${item.name} added to cart`,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go to cart"
          onClick={() => router.push('/cart')}
        >
          View Cart
        </ToastAction>
      ),
    });
  };
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <PlusIcon  />Add to Cart
    </Button>
  );
};

export default AddToCart;
