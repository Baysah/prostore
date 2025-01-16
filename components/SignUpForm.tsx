'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {  signUpDefaultValues } from '@/lib/constants';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {  signUpWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';

const SignInForm = () => {
  const [data, action] = useActionState(signUpWithCredentials, {
    success: false,
    message: '',
  });
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Sign Up'}
      </Button>
    );
  };
  return (
    <form action={action} className="flex flex-col space-y-6">
      <input
        type="hidden"
        className="hidden"
        name="callbackUrl"
        value={callbackUrl}
      />
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

export default SignInForm;
