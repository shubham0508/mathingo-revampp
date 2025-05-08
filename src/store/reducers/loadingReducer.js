import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    loadingStates: {},
    globalLoading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      const { endpoint, isLoading } = action.payload;
      state.loadingStates[endpoint] = isLoading;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    resetLoadingStates: (state) => {
      state.loadingStates = {};
      state.globalLoading = false;
    },
  },
});

export const { setLoading, setGlobalLoading, resetLoadingStates } =
  loadingSlice.actions;
export default loadingSlice.reducer;
