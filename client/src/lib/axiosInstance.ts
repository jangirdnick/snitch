import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { type AppStore } from '@/store/store';
import {
  logout,
  setAccessToken,
  setIsAuthenticated,
  setSessionExpired,
} from '@/features/auth/state/auth.slice';

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = (store: AppStore) => {
  api.interceptors.request.use(
    (config) => {
      // 1. Tracing: Add a unique ID for every single network attempt
      if (!config.headers['X-Request-Id']) {
        config.headers['X-Request-Id'] = crypto.randomUUID();
      }

      // 2. Auth: Attach Bearer token
      const access_token = store.getState().auth.access_token;
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryAxiosRequestConfig;
      const status = error.response?.status;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const isRefreshCall = originalRequest.url?.includes('/auth/session/refresh');
      const isLoginCall = originalRequest.url?.includes('/auth/login');
      const isRegisterCall = originalRequest.url?.includes('/auth/register');

      if (status !== 401 || isRefreshCall || isLoginCall || isRegisterCall) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use the Vite dev-proxy path consistently (same origin, avoids CORS).
        const { data } = await axios.post(
          '/api/auth/session/refresh',
          {},
          { withCredentials: true },
        );

        const newAccessToken = data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('New access token not found');
        }

        store.dispatch(setAccessToken(newAccessToken));
        store.dispatch(setIsAuthenticated(true));

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // ── Multipart retry fix ────────────────────────────────────────────────
        // When the original request used FormData, Axios generated a unique
        // `boundary` and embedded it in the Content-Type header at that moment.
        // On retry the FormData object is still live, but if we keep the stale
        // header (with the old boundary string) the server's multipart parser
        // will reject the body because the boundary won't match the actual data.
        // Deleting Content-Type forces Axios to re-derive it (including the
        // correct new boundary) from the live FormData object.
        if (originalRequest.data instanceof FormData) {
          delete originalRequest.headers['Content-Type'];
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        store.dispatch(setSessionExpired(true));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};
