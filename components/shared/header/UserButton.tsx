import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { User2Icon } from 'lucide-react';

const UserButton = async () => {
    const session = await auth();

    if (!session) {
        return (
          <Button asChild variant={'default'}>
            <Link href={'/signin'}>
              <User2Icon /> Sign In
            </Link>
          </Button>
        );
    }
    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? '';

    return (
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center">
              <Button
                variant={'ghost'}
                className="relative w-8 h-8 rounded-full ml-2 items-center justify-center bg-gray-200"
              >
                {firstInitial}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">
                  {session.user?.name}
                </span>
                <span className="text-sm text-muted-foreground leading-none">
                  {session.user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className='p-0 mb-1'>
              <form action={signOutUser} className='w-full'>
                <Button variant={'default'} className='w-full py-4 px-2 h-4'>
                  Sign Out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
}
 
export default UserButton;