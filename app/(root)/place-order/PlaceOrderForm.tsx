'use client';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { createOrder } from '@/lib/actions/order.actions';
import { CheckIcon, LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlaceOrderForm = () => {
  const router = useRouter();

  const SubmitBtn = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          <CheckIcon className="h-4 w-4" />
        )}
        Place Order
      </Button>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <SubmitBtn />
    </form>
  );
};

export default PlaceOrderForm;
