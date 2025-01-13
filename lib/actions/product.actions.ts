/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

//get all products
export const getProducts = async () => {
  const products = await prisma.product.findMany();
};

//get latest products
export const getLatestProducts = async () => {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return convertToPlainObject(products);
};

//get product by slug
export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findUnique({
    where: {
      slug: slug
    }
  })
}
