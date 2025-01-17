'use server';
import { signInFormSchema, signUpFormSchema } from '@/lib/schemas';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { prisma } from '@/db/prisma';
import { log } from 'console';
import { formatError } from '../utils';
import { hash } from '../encrypt';

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
};

//Sign up the user with credentials
export const signUpWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    //get the user data and validate it
    const user = signUpFormSchema.parse({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    });

    //hash the password
    const hashedPassword = await hash(user.password);

    //insert the user into the database
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    })
    //sign in the user
    await signIn('credentials', {
      email: user.email,
      password: user.password,
    });
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};
