'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInDefaultValues } from '@/lib/constants';

const SignUpForm = () => {
  return (
    <form className="flex flex-col space-y-6">
      <div>
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
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          defaultValue={signInDefaultValues.password}
        />
      </div>
      <div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
