import { baseApi } from "@/lib/baseRTKQuery";

export const youtubeVideoExtractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    youtubeExtracter: builder.mutation({
      query: ({ query, limit = 10 }) => ({
        url: 'youtube_extractor',
        method: 'POST',
        body: { query, limit },
      }),
      invalidatesTags: ['YouTube'],
    }),
  }),
});

export const { useYoutubeExtracterMutation } = youtubeVideoExtractApi;
