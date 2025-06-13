import { baseApi } from '@/lib/baseRTKQuery';

export const feedbackAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    feedbackVote: builder.mutation({
      query: (data) => ({
        url: 'vote',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FeedbackVote'],
    }),
  }),
});

export const { useFeedbackVoteMutation } = feedbackAPi;
