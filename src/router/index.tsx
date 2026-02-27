import { createBrowserRouter, Navigate } from 'react-router-dom';

import { RouteGuard } from '@/components/RouteGuard';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminPage } from '@/pages/AdminPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RouteGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'dashboard', element: <DashboardPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <RouteGuard roles={['admin']} />,
    children: [
      {
        element: <MainLayout />,
        children: [{ index: true, element: <AdminPage />],
      },
    ],
  },
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate replace to="/404" />,
  },
]);
