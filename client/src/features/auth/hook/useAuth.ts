import { useCallback } from 'react';
import {
  setMessage,
  setLoading,
  setUser,
  setError,
  setAccessToken,
  setIsAuthenticated,
  logout as setLogout,
} from '../state/auth.slice';
import { register, login, verifyEmail, logout, logoutAllDevices, getMe } from '../service/auth.api';
import { useAppDispatch } from '@/store/hooks';
import { AxiosError } from 'axios';
import type { CreateUserDto, LoginUserDto } from '@snitch/schemas';

function getErrorMessage(error: unknown): string {
  // AxiosError must be checked BEFORE Error — AxiosError extends Error,
  // so `instanceof Error` would always match first and lose the server message.
  if (error instanceof AxiosError) {
    return (error.response?.data?.error?.message as string) ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const handleRegister = useCallback(
    async (payload: CreateUserDto) => {
      try {
        dispatch(setLoading(true));
        const data = await register(payload);
        if (data.success) {
          dispatch(setMessage(data.message));
          return true;
        } else {
          dispatch(setError(data.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleVerifyEmail = useCallback(
    async (email: string) => {
      try {
        dispatch(setLoading(true));
        const data = await verifyEmail(email);
        if (data.success) {
          dispatch(setMessage(data.message));
          return true;
        } else {
          dispatch(setError(data.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleLogin = useCallback(
    async (payload: LoginUserDto) => {
      try {
        dispatch(setLoading(true));
        const data = await login(payload);
        if (data.success) {
          dispatch(setMessage(data.message));
          dispatch(setUser(data.data.user));
          dispatch(setAccessToken(data.data.accessToken));
          dispatch(setIsAuthenticated(true));
          return true;
        } else {
          dispatch(setError(data.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleLogout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await logout();
      if (data.success) {
        dispatch(setLogout());
        dispatch(setMessage(data.message));
        return true;
      } else {
        dispatch(setError(data.error.message));
        return false;
      }
    } catch (error: unknown) {
      dispatch(setError(getErrorMessage(error)));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLogoutAllDevices = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await logoutAllDevices();
      if (data.success) {
        dispatch(setLogout());
        dispatch(setMessage(data.message));
        return true;
      } else {
        dispatch(setError(data.error.message));
        return false;
      }
    } catch (error: unknown) {
      dispatch(setError(getErrorMessage(error)));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetMe = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      if (data.success) {
        dispatch(setUser(data.data.user));
        dispatch(setIsAuthenticated(true));
        return true;
      } else {
        dispatch(setLogout());
        dispatch(setError(data.error.message));
        return false;
      }
    } catch (error: unknown) {
      dispatch(setLogout());
      dispatch(setError(getErrorMessage(error)));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    handleRegister,
    handleVerifyEmail,
    handleLogin,
    handleLogout,
    handleLogoutAllDevices,
    handleGetMe,
  };
};
