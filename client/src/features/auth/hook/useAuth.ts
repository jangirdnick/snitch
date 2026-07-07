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

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : error instanceof AxiosError
      ? (error.response?.data.error.message as string)
      : 'An unknown error occurred';
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

  async function handleRegister(payload: CreateUserDto) {
    try {
      dispatch(setLoading(true));
      const data = await register(payload);
      if (data.success) {
        dispatch(setMessage(data.message));
      } else {
        dispatch(setError(data.error.message));
      }
    } catch (error: unknown) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyEmail(email: string) {
    try {
      dispatch(setLoading(true));
      const data = await verifyEmail(email);
      console.warn(data);
      if (data.success) {
        dispatch(setMessage(data.message));
      } else {
        dispatch(setError(data.error.message));
      }
    } catch (error: unknown) {
      console.log(error);
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin(payload: LoginUserDto) {
    try {
      dispatch(setLoading(true));
      const data = await login(payload);
      if (data.success) {
        dispatch(setMessage(data.message));
        dispatch(setUser(data.data.user));
        dispatch(setAccessToken(data.data.accessToken));
        dispatch(setIsAuthenticated(true));
      } else {
        dispatch(setError(data.error.message));
      }
    } catch (error: unknown) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      const data = await logout();
      if (data.success) {
        dispatch(setMessage(data.message));
        dispatch(setLogout());
      } else {
        dispatch(setError(data.error.message));
      }
    } catch (error: unknown) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogoutAllDevices() {
    try {
      dispatch(setLoading(true));
      const data = await logoutAllDevices();
      if (data.success) {
        dispatch(setMessage(data.message));
        dispatch(setLogout());
      } else {
        dispatch(setError(data.error.message));
      }
    } catch (error: unknown) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      if (data.success) {
        dispatch(setUser(data.data.user));
        dispatch(setIsAuthenticated(true));
      } else {
        dispatch(setError(data.error.message));
        dispatch(setLogout());
      }
    } catch (error: unknown) {
      dispatch(setLogout());
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleVerifyEmail,
    handleLogin,
    handleLogout,
    handleLogoutAllDevices,
    handleGetMe,
  };
};
