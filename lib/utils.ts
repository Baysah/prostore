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
