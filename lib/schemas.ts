import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    'Price must have exactly 2 decimal places'
  );

//Schema for inserting a new product
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be atleast 3 characters'),
  slug: z.string().min(3, 'Slug must be atleast 3 characters'),
  category: z.string().min(3, 'Category must be atleast 3 characters'),
  brand: z.string().min(3, 'Brand must be atleast 3 characters'),
  description: z.string().min(3, 'Description must be atleast 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have atleast 1 image'),
  isFeatured: z.coerce.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(8, 'Password must be atleast 8 characters'),
});

//Schema for User Signup
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be atleast 3 characters'),
    email: z.string().email('Email is invalid'),
    password: z.string().min(8, 'Password must be atleast 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be atleast 8 characters'),
  })
  .refine(
    (val) => val.password === val.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );
