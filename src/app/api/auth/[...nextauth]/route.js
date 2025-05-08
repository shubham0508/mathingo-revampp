import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/store/slices/authApi';

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
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isGuest: { type: 'text' },
        guestToken: { type: 'text' },
        username: { type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (credentials.isGuest === 'true' && credentials.guestToken) {
            return {
              id: 'guest',
              name: credentials.username || 'Guest User',
              email: 'guest@example.com',
              accessToken: credentials.guestToken,
              isGuest: true,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            };
          }

          const response = await authApi.endpoints.login.initiate({
            username: credentials.email,
            password: credentials.password,
          });

          if (response) {
            const { user, access_token, refresh_token } = response;
            return {
              ...user,
              accessToken: access_token,
              refreshToken: refresh_token,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
              isGuest: false,
            };
          } else {
            throw new Error('Login failed');
          }
        } catch (error) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const response = await authApi.googleOAuth(account.id_token);

          if (response) {
            account.backendToken = response.access_token;
            account.refreshToken = response.refresh_token;
            return true;
          }
          return false;
        } catch (error) {
          console.error('Google OAuth error:', error);
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
          isGuest: user.isGuest,
        };
      }

      if (token.isGuest) {
        return token;
      }

      if (token.tokenExpires && Date.now() > token.tokenExpires - 300000) {
        try {
          const response = await authApi.refreshToken(token.refreshToken);

          if (response) {
            return {
              ...token,
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            };
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          return { ...token, error: 'RefreshAccessTokenError' };
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
        isGuest: token.isGuest,
      };
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.accessToken && !token.isGuest) {
        try {
          await authApi.logout(token.accessToken);
        } catch (error) {
          console.error('Logout error:', error);
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('guestToken');
      }
    },
  },
});

export { handler as GET, handler as POST };
