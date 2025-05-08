import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    showAuthError: false,
    authStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    showAuthErrorDialog: (state) => {
      state.showAuthError = true;
    },
    hideAuthErrorDialog: (state) => {
      state.showAuthError = false;
    },
    setAuthStatus: (state, action) => {
      state.authStatus = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.authStatus = 'failed';
    },
    resetAuth: (state) => {
      state.isAuthenticated = false;
      state.authStatus = 'idle';
      state.error = null;
      state.showAuthError = false;
    },
  },
});

export const {
  showAuthErrorDialog,
  hideAuthErrorDialog,
  setAuthStatus,
  setAuthenticated,
  setAuthError,
  resetAuth,
} = authSlice.actions;
export default authSlice.reducer;
