import { Button } from '@/components/ui/button';
import ThemeToggler from './mode-toggle';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCartIcon,} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './UserButton';

const Menu = async() => {
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
        <UserButton />
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
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
