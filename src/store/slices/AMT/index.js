import { baseApi } from '@/lib/baseRTKQuery';

export const aiMathTutorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    aiExtractQuestion: builder.mutation({
      query: (data) => ({
        url: 'tutor_question',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TutorQuestion'],
    }),
  }),
});

export const { useAiExtractQuestionMutation } = aiMathTutorApi;
