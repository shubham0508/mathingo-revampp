import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "@/store/slices/authApi";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Use RTK Query mutation directly
          const response = await authApi.endpoints.login.initiate({
            username: credentials.email,
            password: credentials.password,
          });
          
          if ('data' in response) {
            const { user, access_token, refresh_token } = response.data;
            return {
              ...user,
              accessToken: access_token,
              refreshToken: refresh_token,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            };
          } else {
            throw new Error(response.error?.data?.message || 'Login failed');
          }
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          const response = await authApi.endpoints.googleOAuth.initiate({
            access_token: account.id_token,
          });
          
          if ('data' in response) {
            account.backendToken = response.data.access_token;
            account.refreshToken = response.data.refresh_token;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Google OAuth error:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          ...user,
          accessToken: account?.backendToken || user.accessToken,
          refreshToken: account?.refreshToken || user.refreshToken,
          tokenExpires: user.tokenExpires,
        };
      }

      // Refresh token if about to expire (5 minutes before)
      if (token.tokenExpires && Date.now() > token.tokenExpires - 300000) {
        try {
          const response = await authApi.endpoints.refreshToken.initiate({
            refresh_token: token.refreshToken,
          });
          
          if ('data' in response) {
            return {
              ...token,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            };
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...token,
        id: token.id,
        email: token.email,
        name: token.name,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.accessToken) {
        try {
          await authApi.endpoints.logout.initiate();
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    },
  },
});

export { handler as GET, handler as POST };