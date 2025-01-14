/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import { signOutUser } from '@/lib/actions/user.actions';
import { useActionState } from 'react';
import { Button } from './ui/button';
const SignOutForm = () => {
  const [data, action] = useActionState(signOutUser, {
    success: false,
    message: '',
  });
  return (
      <form action={action} className="flex items-center justify-center">
        <Button type="submit">Sign Out</Button>
      </form>
  );
};

export default SignOutForm;
