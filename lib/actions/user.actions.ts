'use server';
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  createUserSchema,
  updateUserSchema,
} from '@/lib/schemas';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { prisma } from '@/db/prisma';
import { log } from 'console';
import { formatError } from '../utils';
import { hash } from '../encrypt';
import { ShippingAddress } from '@/types';
import { z } from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    });
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
  if (!user) throw new Error('User not found');
  return user;
};

//Update user address to database
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();
    const address = shippingAddressSchema.parse(data);
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        address: address,
      },
    });
    return { success: true, message: 'Address updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

//Update user's payment method
export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });
    return { success: true, message: 'Payment method successfully updated' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

//update user profile
export const updateProfile = async (user: { name: string; email: string }) => {
  try {
    const session = await auth();
    //fetch the current user from the db
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error('User not found');

    //update the user's name
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });
    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//get all users
export const getAllUsers = async ({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  const data = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();
  const totalPages = Math.ceil(dataCount / limit);

  return {
    data,
    dataCount,
    totalPages,
  };
};

// delete user
export const deleteUser = async (userId: string) => {
  try {
    //check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    //delete the user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//create new user - Admin Only
export const createUser = async (prevState: unknown, formData: FormData) => {
  try {
    //get the user data and validate it
    const user = createUserSchema.parse({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
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
        role: user.role,
        password: hashedPassword,
      },
    });
    //revalidate the users page
    revalidatePath('/admin/users');
    redirect('/admin/users');
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};

//Update user Account - Admin Only
export const updateUserAccount = async (user: z.infer<typeof updateUserSchema>) => {
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        role: user.role,
      },
    });
    revalidatePath('/admin/users');
    return { success: true, message: 'Account updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
