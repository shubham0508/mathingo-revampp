import { baseApi } from '@/lib/baseRTKQuery';

export const smartSolutionCheckApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sscExtractImage: builder.mutation({
      query: (data) => ({
        url: 'verify_solution_image',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Solution'],
    }),
    sscExtractText: builder.mutation({
      query: (data) => ({
        url: 'scc_verify_text',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Solution'],
    }),
    sscQNAExtraction: builder.mutation({
      query: (data) => ({
        url: 'scc_qna_extraction',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Solution'],
    }),
  }),
});

export const {
  useSscExtractImageMutation,
  useSscExtractTextMutation, 
  useSscQNAExtractionMutation
} = smartSolutionCheckApi;
