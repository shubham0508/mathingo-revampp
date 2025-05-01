import { baseApi } from "@/lib/baseRTKQuery";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: 'create-order',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `verify-payment?order_id=${data.order_id}&payment_id=${data.payment_id}&signature=${data.signature}&plan=${data.plan}&interval=${data.interval}`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment', 'Subscription'],
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi;
