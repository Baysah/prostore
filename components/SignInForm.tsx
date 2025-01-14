'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInDefaultValues } from '@/lib/constants';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';

const SignInForm = () => {

  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';


  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? 'Signing in...' : 'Sign In'}
      </Button>
    );
  };
  return (
    <form action={action} className="flex flex-col space-y-6">
      <div>
        <input type="hidden" className="hidden" name='callbackUrl' value={callbackUrl} />
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          defaultValue={signInDefaultValues.password}
        />
      </div>
      <div>
        <SignInButton />
      </div>
      {data && !data.success && (
        <div className="text-center text-destructive">{data.message}</div>
      )}
    </form>
  );
};

export default SignInForm;
