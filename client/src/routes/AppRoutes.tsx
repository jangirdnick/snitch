import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/404Page';
import Dashboard from '@/pages/(admin)/Dashboard';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
