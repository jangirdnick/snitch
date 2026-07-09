import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/404Page';

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
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
