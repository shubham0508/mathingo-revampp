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
    haRelatedYoutubeVideos: builder.mutation({
      query: ({ query, limit = 10 }) => ({
        url: 'youtube_extractor',
        method: 'POST',
        body: { query, limit },
      }),
      invalidatesTags: ['YouTube'],
    }),
    haRelatedQuestions: builder.mutation({
      query: ({ query, limit = 10 }) => ({
        url: 'similar_question',
        method: 'POST',
        body: { query, limit },
      }),
      invalidatesTags: ['SimilarQuestions'],
    }),
  }),
});

export const {
  useHaQuestionExtractionMutation,
  useHaSolutionExtractionMutation,
  useHaRelatedQuestionsMutation,
  useHaRelatedYoutubeVideosMutation
} = homeworkAssistantApi;
