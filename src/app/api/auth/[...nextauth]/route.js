import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import authApi from '@/lib/auth-api';

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
        isGuest: { label: 'Is Guest', type: 'text' },
        guestToken: { label: 'Guest Token', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.isGuest === 'true') {
          try {
            const guestResponse = await authApi.guestUserLogin();

            if (!guestResponse?.access_token) {
              throw new Error(
                'Guest authentication failed - no token received',
              );
            }

            return {
              id: guestResponse.user?.id || 'guest-' + Date.now(),
              name: guestResponse.user?.name || 'Guest User',
              email: guestResponse.user?.email || 'guest@example.com',
              accessToken: guestResponse.access_token,
              refreshToken: guestResponse.refresh_token,
              isGuest: true,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            };
          } catch (error) {
            console.error('Guest authentication error:', error);
            throw new Error(error.message || 'Guest authentication failed');
          }
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const loginResponse = await authApi.login({
            username: credentials.email,
            password: credentials.password,
          });

          if (!loginResponse?.access_token) {
            throw new Error('Invalid credentials - no access token received');
          }

          const profileResponse = await authApi.profile(
            loginResponse.access_token,
          );

          return {
            id: loginResponse.user?.id || profileResponse.data?.id,
            name: loginResponse.user?.name || profileResponse.data?.name,
            email: loginResponse.user?.email || profileResponse.data?.email,
            image: loginResponse.user?.image || profileResponse.data?.image,
            ...profileResponse.data,
            accessToken: loginResponse.access_token,
            refreshToken: loginResponse.refresh_token,
            tokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isGuest: false,
          };
        } catch (error) {
          console.error('Login authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth Error] Code: ${code}`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth Warning] Code: ${code}`);
    },
    debug(code, metadata) {
      console.debug(`[NextAuth Debug] Code: ${code}`, metadata);
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour - check for updates
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (user?.isGuest) return true;

      try {
        if (account?.provider === 'google') {
          const response = await authApi.googleOAuth(account.id_token);

          if (!response?.access_token) {
            console.error('Google OAuth failed - no access token received');
            return false;
          }

          account.backendToken = response.access_token;
          account.backendRefreshToken = response.refresh_token;

          try {
            const userProfile = await authApi.profile(response.access_token);

            Object.assign(user, {
              id: response.user?.id || userProfile.data?.id,
              name: response.user?.name || userProfile.data?.name,
              email:
                response.user?.email ||
                userProfile.data?.email ||
                profile?.email,
              image:
                response.user?.image ||
                userProfile.data?.image ||
                profile?.picture,
              ...userProfile.data,
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
              isGuest: false,
            });
          } catch (profileError) {
            console.error(
              'Failed to fetch user profile after Google OAuth:',
              profileError,
            );
            Object.assign(user, {
              id: response.user?.id,
              name: response.user?.name || profile?.name,
              email: response.user?.email || profile?.email,
              image: response.user?.image || profile?.picture,
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
              isGuest: false,
            });
          }

          return true;
        }

        if (account?.provider === 'apple') {
          return true;
        }

        return true;
      } catch (error) {
        console.error(
          `${account?.provider} OAuth authentication failed:`,
          error,
        );
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        return {
          ...token,
          ...session.user,
          tokenExpires: token.tokenExpires,
        };
      }

      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          accessToken: account?.backendToken || user.accessToken,
          refreshToken: account?.backendRefreshToken || user.refreshToken,
          tokenExpires: user.tokenExpires || Date.now() + 24 * 60 * 60 * 1000,
          provider: account?.provider,
          isGuest: user.isGuest || false,
        };
      }

      if (token.isGuest) {
        if (token.tokenExpires && Date.now() >= token.tokenExpires) {
          return { ...token, error: 'TokenExpiredError' };
        }
        return token;
      }

      const shouldRefresh =
        token.tokenExpires && Date.now() >= token.tokenExpires - 60 * 60 * 1000;

      if (!shouldRefresh) {
        return token;
      }

      try {
        if (!token.refreshToken) {
          console.error('No refresh token available');
          return { ...token, error: 'RefreshTokenError' };
        }

        const response = await authApi.refreshToken(token.refreshToken);

        if (!response?.access_token) {
          console.error('Token refresh failed - no access token received');
          return { ...token, error: 'RefreshAccessTokenError' };
        }

        let updatedProfile = {};
        try {
          const userProfile = await authApi.profile(response.access_token);
          updatedProfile = userProfile.data || {};
        } catch (profileError) {
          console.warn(
            'Failed to fetch updated profile after token refresh:',
            profileError,
          );
        }

        return {
          ...token,
          ...updatedProfile,
          accessToken: response.access_token,
          refreshToken: response.refresh_token || token.refreshToken,
          tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        };
      } catch (error) {
        console.error('Token refresh error:', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error;
      }

      session.user = {
        id: token.id,
        email: token.email,
        name: token.name || (token.isGuest ? 'Guest User' : ''),
        image: token.image,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        tokenExpires: token.tokenExpires,
        provider: token.provider,
        isGuest: token.isGuest || false,
        ...Object.keys(token).reduce((acc, key) => {
          if (
            ![
              'iat',
              'exp',
              'jti',
              'sub',
              'accessToken',
              'refreshToken',
              'tokenExpires',
              'provider',
              'isGuest',
              'id',
              'email',
              'name',
              'image',
            ].includes(key)
          ) {
            acc[key] = token[key];
          }
          return acc;
        }, {}),
      };

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.accessToken && !token?.isGuest) {
        try {
          await authApi.logout(token.accessToken);
        } catch (error) {
          console.error('Logout API call failed:', error);
        }
      }

      if (typeof window !== 'undefined' && token?.isGuest) {
        try {
          localStorage.removeItem('isGuestUser');
        } catch (error) {
          console.warn('Failed to clear localStorage:', error);
        }
      }
    },
  },
});

export { handler as GET, handler as POST };
