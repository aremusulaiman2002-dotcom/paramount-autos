import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Add detailed logging
          console.log('Auth attempt:', credentials?.email);
          
          // Simple validation - make sure this matches exactly
          if (credentials?.email === "admin@paramountautos.com" && credentials?.password === "admin123") {
            console.log('✅ Authentication successful');
            return {
              id: "1",
              email: "admin@paramountautos.com",
              name: "Admin User",
              role: "admin"
            };
          }
          
          console.log('❌ Invalid credentials');
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  debug: true, // Enable debug mode
};