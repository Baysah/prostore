'use client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowBigRight, Loader2Icon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { camelCaseToTitleCase } from '@/lib/utils';
import Image from 'next/image';
import loader from '@/assets/loader.gif';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';

interface Props {
  preferredPaymentMethod: string | null;
}
const PaymentMethodForm = ({ preferredPaymentMethod }: Props) => {
const [isLoaded , setIsLoaded] = useState(false);
useEffect(() => {setIsLoaded(true);}, []);


  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async() => {
        const res = await updateUserPaymentMethod(values)

        if(!res.success){
            toast({
                variant: 'destructive',
                title: res.message,
            })
            return
        }
        router.push('/place-order')
    });
  }

  if (!isLoaded) {
    return (
        <div className="flex-center">
            <Image src={loader} alt="loading..." width={150} height={150} />
        </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-x-4" suppressHydrationWarning>
      <h1 className="h2-bold mt-4">Payment Method</h1>
      <p className="text-sm text-muted-foreground">
        Please select your preferred payment method.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          method="post"
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Preferred Payment Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-2"
                      defaultValue={DEFAULT_PAYMENT_METHOD}
                    >
                      {PAYMENT_METHODS.map((method) => {
                        const formatedMethod = camelCaseToTitleCase(method);
                        return (
                          <FormItem
                            key={method}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={method}
                                id={method}
                                checked={field.value === method}
                              ></RadioGroupItem>
                            </FormControl>
                            <Label className="font-normal" htmlFor={method}>
                              {formatedMethod}
                            </Label>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowBigRight className="h-4 w-4" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
