'use client';
import { useToast } from '@/hooks/use-toast';
import { updateProfileSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { updateProfile } from '@/lib/actions/user.actions';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const UpdateProfileForm = () => {
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const { toast } = useToast();
  const handleSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(data);
    if (!res.success) {
        return toast({
            variant: 'destructive',
            title: 'Error Updating Profile',
            description: res.message,
        })
    }
    const newSession = {
        ...session,
        user: {
            ...session?.user,
            name: data.name,
        }
    }
    await update(newSession)
    toast({
        variant: 'default',
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
    })  
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input disabled {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size={'lg'}
            className=" button col-span-2 w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
