import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../../lib/dbConnect'; // Path check kar lena agar error aaye
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        // 1. Check if user exists
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) throw new Error('No user found with this email.');

        // 2. Check if password is correct using bcrypt
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error('Incorrect password.');

        // 3. Return user object if successful
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Session mein user id aur role inject karne ke liye
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Hum custom login page banayenge
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };