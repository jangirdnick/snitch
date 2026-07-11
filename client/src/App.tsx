import { RouterProvider } from 'react-router';
import router from './routes/AppRoutes';
import { useEffect } from 'react';
import { useAuth } from './features/auth/hook/useAuth';
import { useAuthToast } from './features/auth/hook/useAuthToast';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { handleGetMe } = useAuth();
  useAuthToast();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}
