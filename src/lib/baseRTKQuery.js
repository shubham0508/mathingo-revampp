import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export const baseApi = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      prepareHeaders: async (headers) => {
        const session = await getSession();
        if (session?.user?.accessToken) {
          headers.set('authorization', `Bearer ${session.user.accessToken}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
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
