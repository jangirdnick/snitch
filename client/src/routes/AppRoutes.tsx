import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/404Page';
import Dashboard from '@/pages/(admin)/Dashboard';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import InventoryPage from '@/pages/(admin)/(inventory)/InventoryPage';
import CreateProductPage from '@/pages/(admin)/(inventory)/CreateProductPage';
import EditProductPage from '@/pages/(admin)/(inventory)/EditProductPage';
import CategoryPage from '@/pages/(admin)/(category)/CategoryPage';
import CreateCategoryPage from '@/pages/(admin)/(category)/CreateCategoryPage';
import EditCategoryPage from '@/pages/(admin)/(category)/EditCategoryPage';

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
          {
            path: 'inventory',
            element: <InventoryPage />,
          },
          {
            path: 'inventory/create',
            element: <CreateProductPage />,
          },
          {
            path: 'inventory/edit/:productId',
            element: <EditProductPage />,
          },
          {
            path: 'categories',
            element: <CategoryPage />,
          },
          {
            path: 'categories/create',
            element: <CreateCategoryPage />,
          },
          {
            path: 'categories/edit/:categoryId',
            element: <EditCategoryPage />,
          },
          {
            path: 'orders',
            element: <div>Orders</div>,
          },
          {
            path: 'customers',
            element: <div>Customers</div>,
          },
          {
            path: 'reviews',
            element: <div>Reviews</div>,
          },
          {
            path: 'coupons',
            element: <div>Coupons</div>,
          },
          {
            path: 'analytics',
            element: <div>Analytics</div>,
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
