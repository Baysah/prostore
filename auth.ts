/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { compare } from './lib/encrypt';

export const config = {
  pages: {
    signIn: '/signin',
    error: '/signin', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        // fetch user from db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //check if user exists and password is correct
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password as string
          );

          //if password is correct
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        //if user does not exist or password does not match

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user, trigger }: any) {
      //set the user ID from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //if there is an update, set the username
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      //Assign user fields to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //check if the user no name
        if (user.name === 'No Name') {
          token.name = user.email!.split('@')[0];

          //update db with token name
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: token.name,
            },
          });
        }
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesIbject = await cookies();
          const sessionCartId = cookiesIbject.get('sessionCartId')?.value;

          //check if there is a  session cart id
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {
                sessionCartId: sessionCartId,
              },
            });
            if (sessionCart) {
              //delete all current carts
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              });

              //create new cart
              await prisma.cart.update({
                where: {
                  id: sessionCart.id,
                },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }
      //handle session updates
      if(session?.user.name && trigger === 'update'){
        token.name = session.user.name
      }
      return token;
    },
    authorized: ({ request, auth }: any) => {
      //Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //get the path name from the request
      const {pathname} = request.nextUrl;

      //Check if user is not authenticated && accessing a protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname))) return false

      //check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        //generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        //clone request headers
        const newRequestHeaders = new Headers(request.headers);

        //Create new response and add the new headers
        const Response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        //set newly generated sesion Cart Id in the response cookies
        Response.cookies.set('sessionCartId', sessionCartId);

        return Response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
