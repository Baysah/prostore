import { Metadata } from "next";
import { auth } from "@/auth";
import {SessionProvider} from 'next-auth/react'
import UpdateProfileForm from "@/components/shared/UpdateProfileForm";

export const metadata: Metadata = {
    title: 'User Profile',
}
const ProfilePage = async() => {
    const session = await auth();
    return (
      <SessionProvider session={session}>
        <div className="max-w-md mx-auto space-y-4">
            <h2 className="h2-bold">User Profile</h2>
          <UpdateProfileForm />
        </div>
      </SessionProvider>
    );
}
 
export default ProfilePage;