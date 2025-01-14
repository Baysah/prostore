import { Button } from '@/components/ui/button';
import ThemeToggler from './mode-toggle';
import Link from 'next/link';
import { auth } from '@/auth';
import { EllipsisVertical, ShoppingCartIcon, UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import SignOutForm from '@/components/SignOutForm';

const Menu = async() => {
  const session = await auth();
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs">
        <ThemeToggler />
        <Button asChild variant={'ghost'}>
          <Link href={'/cart'}>
            <ShoppingCartIcon />
            Cart
          </Link>
        </Button>
        <Button asChild variant={'default'}>
          {session ? (
            <SignOutForm />
          ) : (
            <Link href={'/signin'}>
              <UserIcon />
              Sign In
            </Link>
          )}
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ThemeToggler />
            <Button asChild variant={'ghost'}>
              <Link href={'/cart'}>
                <ShoppingCartIcon />
                Cart
              </Link>
            </Button>
            <Button asChild variant={'default'}>
              <Link href={'/signin'}>
                <UserIcon />
                Sign In
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
