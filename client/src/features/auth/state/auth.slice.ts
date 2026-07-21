import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { JwtAccessTokenPayload } from '@snitch/types';

export interface AuthState {
  user: JwtAccessTokenPayload | null;
  access_token: string;
  isAuthenticated: boolean;
  loading: boolean;
  sessionExpired: boolean;
  error: string | null;
  message: string;
}

const initialState: AuthState = {
  user: null,
  access_token: '',
  isAuthenticated: false,
  // Start as true so ProtectedRoute waits for the session-restore call
  // (handleGetMe) to finish before making any auth decisions.
  // Without this, the first synchronous render sees isAuthenticated=false
  // and redirects away before the async /me request completes.
  loading: true,
  sessionExpired: false,
  error: null,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<JwtAccessTokenPayload | null>) => {
      state.user = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },

    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },

    setAuth: (
      state,
      action: PayloadAction<{
        user: JwtAccessTokenPayload;
        access_token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.message = `${action.payload.user.firstName} logged in successfully`;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = '';
    },

    logout: (state: AuthState) => {
      state.user = null;
      state.access_token = '';
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = '';
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setIsAuthenticated,
  setLoading,
  setSessionExpired,
  setError,
  setMessage,
  setAuth,
  clearError,
  clearMessage,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
