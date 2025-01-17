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
    async jwt({token, user, trigger, session}: any){

      //Assign user fields to the token
      if(user){
        token.role = user.role;

        //checn if the user no name
        if(user.name === 'No Name'){
          token.name = user.email!.split('@')[0];


          //update db with token name
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              name: token.name
            }
          })
        }
      }
      return token;
    },
    authorized: ({ request, auth }) => {
      //check for session cart cookie
      if(!request.cookies.get('sessionCartId')){
        //generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        //clone request headers
        const newRequestHeaders = new Headers(request.headers);

        //Create new response and add the new headers
        const Response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          }
        })
        //set newly generated sesion Cart Id in the response cookies
        Response.cookies.set('sessionCartId', sessionCartId);

        return Response;
      } else {
        return true;
      }
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
