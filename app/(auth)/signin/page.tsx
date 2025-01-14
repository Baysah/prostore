import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import SignInForm from '@/components/SignInForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();
  if (session) {
    redirect(callbackUrl || '/');
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={'/'} className="flex-center">
            <Image
              src={'/images/logo.svg'}
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Sign in you your account
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          <SignInForm />
        </CardContent>
        <CardFooter className="flex justify-center space-x-1">
          <span>Don&apos;t have an account? </span>
          <span className="text-center text-base underline font-semibold">
            <Link href={'/signup'} target="_self">
              Sign Up
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
