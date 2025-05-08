import { baseApi } from '@/lib/baseRTKQuery';

export const authApi = baseApi.injectEndpoints({
  reducerPath: 'authApi',
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        const formData = new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
          grant_type: 'password',
        });

        return {
          url: 'login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        };
      },
      invalidatesTags: ['Auth'],
    }),

    signup: builder.mutation({
      query: (userData) => ({
        url: 'signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    googleOAuth: builder.mutation({
      query: (accessToken) => ({
        url: 'google_user_info',
        method: 'POST',
        body: { access_token: accessToken },
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshToken: builder.mutation({
      query: (refreshToken) => {
        const formData = new URLSearchParams({
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        });

        return {
          url: 'refresh',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        };
      },
    }),

    sendEmail: builder.mutation({
      query: (emailData) => ({
        url: 'signup/email',
        method: 'POST',
        body: emailData,
      }),
    }),

    verifyOTP: builder.mutation({
      query: (otpData) => ({
        url: 'signup/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: 'signup/create-user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: 'forgot-password',
        method: 'POST',
        body: emailData,
      }),
    }),

    resetPassword: builder.mutation({
      query: (passwordData) => ({
        url: 'reset-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGoogleOAuthMutation,
  useRefreshTokenMutation,
  useSendEmailMutation,
  useVerifyOTPMutation,
  useCreateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGuestUserLoginMutation,
} = authApi;
