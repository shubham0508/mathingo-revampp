import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import authApi from '@/lib/auth-api';

const capitalizeName = (name) => {
  if (!name || typeof name !== 'string') return name;

  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const mergeUserData = (baseData, profileData, fallbackData = {}) => {
  const profile = profileData?.data || {};
  const rawName =
    profile.full_name ||
    baseData.full_name ||
    baseData.name ||
    fallbackData.name;

  return {
    id: profile.user_id || baseData.user_id || baseData.id || fallbackData.id,
    name: capitalizeName(rawName),
    email: profile.email || baseData.email || fallbackData.email,
    image:
      profile.profile_picture ||
      baseData.profile_picture ||
      baseData.image ||
      fallbackData.image,
    username: profile.username || baseData.username || fallbackData.username,
    country: profile.country || baseData.country || fallbackData.country,
    grade: profile.grade || baseData.grade || fallbackData.grade,
    isGuestUser:
      profile.is_guest_user ??
      baseData.is_guest_user ??
      fallbackData.isGuestUser ??
      false,
    status: profile.status || baseData.status || fallbackData.status,
    planType: profile.plan_type || baseData.plan_type || fallbackData.planType,
    level: profile.level || baseData.level || fallbackData.level,
    purpose: profile.purpose || baseData.purpose || fallbackData.purpose,
    startDate:
      profile.start_date || baseData.start_date || fallbackData.startDate,
    endDate: profile.end_date || baseData.end_date || fallbackData.endDate,
  };
};

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

          let profileResponse = null;
          try {
            profileResponse = await authApi.profile(loginResponse.access_token);
          } catch (profileError) {
            console.warn(
              'Failed to fetch profile, using login data:',
              profileError,
            );
          }

          const userData = mergeUserData(
            loginResponse.user || {},
            profileResponse,
          );

          return {
            ...userData,
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

          let userProfile = null;
          try {
            userProfile = await authApi.profile(response.access_token);
          } catch (profileError) {
            console.warn(
              'Failed to fetch user profile after Google OAuth:',
              profileError,
            );
          }

          const userData = mergeUserData(response.user || {}, userProfile, {
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
          });

          Object.assign(user, {
            ...userData,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            isGuest: false,
          });

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
          username: user.username,
          country: user.country,
          grade: user.grade,
          isGuestUser: user.isGuestUser,
          status: user.status,
          planType: user.planType,
          level: user.level,
          purpose: user.purpose,
          startDate: user.startDate,
          endDate: user.endDate,
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

        let userProfile = null;
        try {
          userProfile = await authApi.profile(response.access_token);
        } catch (profileError) {
          console.warn(
            'Failed to fetch updated profile after token refresh:',
            profileError,
          );
        }

        const currentUserData = {
          user_id: token.id,
          full_name: token.name,
          email: token.email,
          profile_picture: token.image,
          username: token.username,
          country: token.country,
          grade: token.grade,
          is_guest_user: token.isGuestUser,
          status: token.status,
          plan_type: token.planType,
          level: token.level,
          purpose: token.purpose,
          start_date: token.startDate,
          end_date: token.endDate,
        };

        const updatedUserData = mergeUserData(currentUserData, userProfile);

        return {
          ...token,
          id: updatedUserData.id,
          name: updatedUserData.name,
          email: updatedUserData.email,
          image: updatedUserData.image,
          username: updatedUserData.username,
          country: updatedUserData.country,
          grade: updatedUserData.grade,
          isGuestUser: updatedUserData.isGuestUser,
          status: updatedUserData.status,
          planType: updatedUserData.planType,
          level: updatedUserData.level,
          purpose: updatedUserData.purpose,
          startDate: updatedUserData.startDate,
          endDate: updatedUserData.endDate,
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
        username: token.username,
        country: token.country,
        grade: token.grade,
        isGuestUser: token.isGuestUser,
        status: token.status,
        planType: token.planType,
        level: token.level,
        purpose: token.purpose,
        startDate: token.startDate,
        endDate: token.endDate,
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
              'username',
              'country',
              'grade',
              'isGuestUser',
              'status',
              'planType',
              'level',
              'purpose',
              'startDate',
              'endDate',
            ].includes(key) &&
            token[key] !== undefined
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
