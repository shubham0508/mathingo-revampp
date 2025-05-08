import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession, signIn } from 'next-auth/react';
import authApi from './auth-api';
import { API_BASE_URL } from '@/config/constant';

let isFetchingGuestToken = false;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (!token && typeof window !== 'undefined') {
      const guestToken = localStorage.getItem('guestToken');
      if (guestToken) {
        headers.set('authorization', `Bearer ${guestToken}`);
      }
    } else if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (
      result?.error?.status === 401 &&
      typeof window !== 'undefined' &&
      !isFetchingGuestToken
    ) {
      localStorage.removeItem('guestToken');

      isFetchingGuestToken = true;

      try {
        const guestRes = await authApi.fetchGuestToken();

        const guestToken = guestRes?.access_token;
        const guestUsername = guestRes?.username ?? 'guest';

        if (guestToken) {
          localStorage.setItem('guestToken', guestToken);

          const signInRes = await signIn('credentials', {
            isGuest: 'true',
            guestToken,
            username: guestUsername,
            redirect: false,
          });

          if (!signInRes?.ok) {
            console.warn('Guest token signIn failed');
          } else {
            result = await rawBaseQuery(args, api, extraOptions);
          }
        }
      } catch (err) {
        console.error('Failed to fetch guest token on 401:', err);
      } finally {
        isFetchingGuestToken = false;
      }
    }

    return result;
  },

  tagTypes: [
    'Profile',
    'Subscription',
    'TutorQuestion',
    'NextHint',
    'Payment',
    'Auth',
    'Solution',
    'YouTube',
    'Homework',
    'MathTutor',
  ],

  endpoints: () => ({}),
});
