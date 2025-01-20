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

  //Cart Schemas
  export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
  })

  export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable(),
  })

  //Schema for shipping address
  export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Full name must be atleast 3 characters'),
    streetAddress: z
      .string()
      .min(3, 'Street address must be atleast 3 characters'),
    city: z.string().min(3, 'City must be atleast 3 characters'),
    state: z.string().min(2, 'State must be atleast 2 characters'),
    postalCode: z.string().min(5, 'Postal Code must be atleast 5 characters'),
    country: z.string().min(3, 'Country is required'),
    lat: z.number().optional(),
    lng: z.number().optional(),
  });


