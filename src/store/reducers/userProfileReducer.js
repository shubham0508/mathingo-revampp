import { createSlice } from '@reduxjs/toolkit';

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    user: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    resetUserDetails: (state) => {
      state.user = {};
    },
    setUserLoading: (state) => {
      state.isLoading = true;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setUserDetails,
  resetUserDetails,
  setUserLoading,
  setUserError,
} = userProfileSlice.actions;
export default userProfileSlice.reducer;
