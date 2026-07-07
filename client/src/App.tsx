import { RouterProvider } from 'react-router';
import router from './routes/AppRoutes';
import { useEffect } from 'react';
import { useAuth } from './features/auth/hook/useAuth';

export default function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
}
