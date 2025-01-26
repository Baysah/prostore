'use client';

import { updateUserSchema } from '@/lib/schemas';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { USER_ROLES } from '@/lib/constants';
import { Button } from '../ui/button';
import { updateUserAccount } from '@/lib/actions/user.actions';

interface Props {
  user: z.infer<typeof updateUserSchema>;
}

const UpdateUserForm = ({ user }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const handleSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUserAccount({
        ...data,
        id: user.id,
      });
      if (!res.success) {
        toast({
          variant: 'default',
          title: 'User Updated',
          description: res.message,
        });
      }
      toast({
        variant: 'default',
        title: 'User Updated',
        description: res.message,
      })
      form.reset();
      router.push('/admin/users');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Updating User',
        description: (error as Error).message,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="email">Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="User NAme" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select
                value={field.value.toString()}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
