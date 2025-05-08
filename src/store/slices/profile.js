import { baseApi } from "@/lib/baseRTKQuery";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfileDetails: builder.query({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: 'profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    updateProfileImage: builder.mutation({
      query: (formData) => ({
        url: 'profile/image',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    deleteProfileImage: builder.mutation({
      query: () => ({
        url: 'profile/image',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    subscriptions: builder.query({
      query: () => ({
        url: 'user/subscriptions',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),

    activeSubscription: builder.query({
      query: () => ({
        url: 'get_latest_active_subscription',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),

    upcomingSubscriptions: builder.query({
      query: () => ({
        url: 'get_upcoming_subscription',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: 'account',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile', 'Auth'],
    }),
  }),
});

export const {
  useUserProfileDetailsQuery,
  useLazyUserProfileDetailsQuery,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,
  useSubscriptionsQuery,
  useLazySubscriptionsQuery,
  useActiveSubscriptionQuery,
  useLazyActiveSubscriptionQuery,
  useUpcomingSubscriptionsQuery,
  useDeleteAccountMutation,
} = profileApi;
