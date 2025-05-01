import { baseApi } from '@/lib/baseRTKQuery';

export const homeworkAssistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    haQuestionExtraction: builder.mutation({
      query: (data) => ({
        url: 'ha_question_text_extraction',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TutorQuestion'],
    }),
    haSolutionExtraction: builder.mutation({
      query: (data) => ({
        url: 'ha_answers_extraction',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TutorQuestion'],
    }),
  }),
});

export const {
  useHaQuestionExtractionMutation,
  useHaSolutionExtractionMutation,
} = homeworkAssistantApi;
