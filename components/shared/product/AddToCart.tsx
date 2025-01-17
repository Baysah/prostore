/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { CartItem, Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusIcon , MinusIcon, LoaderCircleIcon} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';


interface Props {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = ({ item, cart }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(
      async () => {
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
          description: res.message,
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
      }
    )
    
  };
  const handleRemoveFromCart = async() => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      });

      return;
    })
  }

  //check if Item is already in cart
  const existingCartItem = cart && cart.items.find((x) => x.productId === item.productId);



  return existingCartItem ? (
    <div className="flex items-center gap-2">
      <span>
        <Button
          variant={'outline'}
          className="w-full"
          type="button"
          onClick={handleRemoveFromCart}
        >
          {isPending ? (
            <LoaderCircleIcon className="h-4 w-4 animate-spin" />
          ) : (
            <MinusIcon className="h-4 w-4" />
          )}
        </Button>
      </span>
      <span className="px-2">{existingCartItem.qty}</span>
      <span>
        {isPending ? (
          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
        ) : (
          <Button
            variant={'outline'}
            className="w-full"
            type="button"
            onClick={handleAddToCart}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
      </span>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <LoaderCircleIcon className="h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
