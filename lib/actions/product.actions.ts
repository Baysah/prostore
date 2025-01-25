/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PRODUCTS_PAGE_LIMIT } from '../constants';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertProductSchema, updateProductSchema } from '../schemas';

//get all products
export const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
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
      slug: slug,
    },
  });
};

//get product by Id
export const getProductById = async (productId: string) => {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  return convertToPlainObject(data);
};

type GetAllProductsProps = {
  query: string;
  limit?: number;
  page: number;
  category?: string;
};

//get all products
export const getAllProducts = async ({
  query,
  limit = PRODUCTS_PAGE_LIMIT,
  page,
  category,
}: GetAllProductsProps) => {
  const data = await prisma.product.findMany({
    orderBy:{
      createdAt: 'desc'
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const productCount = await prisma.product.count();

  return {
    data,
    productCount,
    totalPages: Math.ceil(productCount / limit),
  };
};

//delete product
export const deleteProduct = async (id: string) => {
  try {
    //check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    //delete the product
    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//create a product
export const createProduct = async (data: z.infer<typeof insertProductSchema>) => {
  try {
    //validate the product
    const product = insertProductSchema.parse(data);

    if(!product) throw new Error('Invalid product');

    //create the product
    await prisma.product.create({
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };

  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}


//update a product
export const updateProduct = async (data: z.infer<typeof updateProductSchema>) => {
  try {
    //validate the product
    const product = updateProductSchema.parse(data);
  if(!product) throw new Error('Invalid product');

    //check if product exists
    const productExists = await prisma.product.findUnique({
      where: {
        id: product.id,
      },
    })

    if (!productExists) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    //update the product
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };

  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
