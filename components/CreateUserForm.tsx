'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUpDefaultValues } from '@/lib/constants';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createUser } from '@/lib/actions/user.actions';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

const CreateUserForm = () => {
  const [data, action] = useActionState(createUser, {
    success: false,
    message: '',
  });

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Create User'}
      </Button>
    );
  };
  return (
    <form action={action} className="flex flex-col space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select name="role">
          <SelectTrigger>Please Select A Role</SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          defaultValue={signUpDefaultValues.password}
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Password"
          defaultValue={signUpDefaultValues.password}
        />
      </div>
      <div>
        <SignUpButton />
      </div>
      {data && !data.success && (
        <div className="text-center text-destructive">{data.message}</div>
      )}
    </form>
  );
};

export default CreateUserForm;
