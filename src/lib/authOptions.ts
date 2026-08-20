// ============================================================
// NextAuth Configuration
// Supports: Google OAuth + Legacy Email/Password (Credentials)
// ============================================================

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],

  providers: [
    // --- Google OAuth Provider ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // --- Legacy Email/Password Provider ---
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Email atau password salah.');
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          throw new Error('Email atau password salah.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // Use JWT strategy (works well with Credentials + OAuth)
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    // When JWT is created, attach user role from database
    async jwt({ token, user }) {
      const email = user?.email || token.email;
      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
        });

        let role = dbUser?.role || 'user';
        if (email === 'sampagakua@gmail.com') {
          role = 'super_admin';
          if (dbUser && dbUser.role !== 'super_admin') {
            await prisma.user.update({ where: { email }, data: { role: 'super_admin' } });
          }
        }

        token.role = role;
        token.userId = dbUser?.id || user?.id || token.userId;
        token.email = email;
      }

      return token;
    },

    // Make role available in session
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).id = token.userId;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};
