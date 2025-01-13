'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/images/404.svg"
        alt="404 not found"
        width={800}
        height={800}
      />
      <div className="flex-center flex-col space-y-4">
        <h1 className="text-3xl font-bold">404 Not Found</h1>
        <p>
          The page you are looking for does not exist.
        </p>
        <Button asChild variant={'default'}>
          <Link href={'/'}>
            <span className="text-sm">Go back home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
