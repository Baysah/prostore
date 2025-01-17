import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//delay for testing purpose
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

//convert prisma object into a regular JS object
export function convertToPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, dec] = num.toString().split('.');
  return dec ? `${int}.${dec.padEnd(2, '0')}` : `${int}.00`;
}

//Format Errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  //check it error is from zod

  if (error.name === 'ZodError') {
    //Handle ZodError
    const fieldErrors = Object.keys(error.issues).map(
      (field) => error.issues[field].message
    );

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    //Handle Prisma Errors
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

//Round number to 2 decimal places
export const round2 = (val:number | string) => {
  if(typeof val === 'number'){
    return Math.round((val + Number.EPSILON) * 100) / 100;
  } else if (typeof val === 'string') {
    return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
}
