'use server';
import { shippingAddressSchema, signInFormSchema, signUpFormSchema, paymentMethodSchema } from '@/lib/schemas';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { prisma } from '@/db/prisma';
import { log } from 'console';
import { formatError } from '../utils';
import { hash } from '../encrypt';
import { ShippingAddress } from '@/types';
import { z } from 'zod';

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

//get User by the ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if(!user) throw new Error('User not found');
  return user;
}

//Update user address to database
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();
    const address = shippingAddressSchema.parse(data);
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      }
    })

    if(!currentUser) throw new Error('User not found');

    

    await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        address: address,
      },
    });
    return { success: true, message: 'Address updated successfully' };
    
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update user's payment method
export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth()
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      }
    })
    if (!currentUser) throw new Error('User not found')
    
    const paymentMethod = paymentMethodSchema.parse(data)
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    })
    return { success: true, message: 'Payment method successfully updated' }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

//update user profile
export const updateProfile = async (user : {name: string; email: string}) => {
  try {
    const session = await auth();
    //fetch the current user from the db
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      }
    })
    if (!currentUser) throw new Error('User not found');

    //update the user's name
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      }
    })
    return {
      success: true,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}