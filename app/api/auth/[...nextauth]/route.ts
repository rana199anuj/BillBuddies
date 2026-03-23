import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isGuest: { label: 'Guest', type: 'text' },
      },
      async authorize(credentials) {
        await connectDB();
        
        // Handle anonymous Guest Login
        if (credentials?.isGuest === 'true') {
          const randomNum = Math.floor(Math.random() * 1000000);
          const guestUser = await User.create({
            name: 'Guest User',
            email: `guest-${randomNum}@billbuddies.app`,
            password: await bcrypt.hash(`guest-pass-${randomNum}`, 10),
          });
          return { id: guestUser._id.toString(), name: guestUser.name, email: guestUser.email };
        }

        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Generate a purely random fallback password for Google OAuth users to satisfy schema
          const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          await User.create({
            name: user.name,
            email: user.email,
            password: await bcrypt.hash(randomPassword, 10),
          });
        }
        return true;
      }
      return true; // Credentials provider
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === 'google') {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) token.id = dbUser._id.toString();
        } else {
          // Credentials provider
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
