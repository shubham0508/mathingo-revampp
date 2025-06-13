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
    checkMySolution: builder.mutation({
      query: (data) => ({
        url: 'student_feedback_report',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CheckMySolution'],
    }),
    aiMathTutorRelatedQuestions: builder.mutation({
      query: (data) => ({
        url: 'similar_question',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AMTSimilarQuestions'],
    }),
    studentSolutionReport: builder.mutation({
      query: (data) => ({
        url: 'student_solution_report',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AMTStudentSolutionReport'],
    }),
  }),
});

export const {
  useAiExtractQuestionMutation,
  useCheckMySolutionMutation,
  useAiMathTutorRelatedQuestionsMutation,
  useStudentSolutionReportMutation
} = aiMathTutorApi;
