import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import UserNav from "@/components/UserNave";
interface Props {
    children: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
    return (
      <>
        <div className="flex flex-col">
          <div className="border-b">
            <div className="container mx-auto">
              <div className="flex items-center h-16 px-4">
                <Link href={'/'} className="w-22">
                  <Image
                    src={'/images/logo.svg'}
                    alt={`${APP_NAME} logo`}
                    width={48}
                    height={48}
                    priority={true}
                  />
                </Link>
                {/**Man Menu */}
                <UserNav className="mx-6"/>
                <div className="ml-auto items-center flex space-x-4">
                  <Menu />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
            {children}
          </div>
        </div>
      </>
    );
}
 
export default UserLayout;