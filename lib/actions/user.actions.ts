/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { signInFormSchema } from '@/lib/schemas';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { log } from 'console';

//Sign in the user with credentials
export const signInWithCredentials = async (
  prevSrate: unknown,
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    log('Email', user.email);
    await signIn('credentials', user);
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid credentials' };
  }
};

// Sign out the user
export const signOutUser = async () => {
  await signOut();
  return { success: true, message: 'Signed out successfully' };
};
