import { Spin } from 'antd';
import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AuthorizedRouteRenderer } from '@/components/AuthorizedRouteRenderer';
import { RouteGuard } from '@/components/RouteGuard';
import { MainLayout } from '@/layouts/MainLayout';

const LoginPage = lazy(async () => ({ default: (await import('@/pages/LoginPage')).LoginPage }));
const ForbiddenPage = lazy(async () => ({
  default: (await import('@/pages/ForbiddenPage')).ForbiddenPage,
}));
const NotFoundPage = lazy(async () => ({ default: (await import('@/pages/NotFoundPage')).NotFoundPage }));

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
          <Spin />
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: withSuspense(<LoginPage />),
    },
    {
      path: '/',
      element: <RouteGuard />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { index: true, element: <AuthorizedRouteRenderer /> },
            { path: '*', element: <AuthorizedRouteRenderer /> },
          ],
        },
      ],
    },
    {
      path: '/403',
      element: withSuspense(<ForbiddenPage />),
    },
    {
      path: '/404',
      element: withSuspense(<NotFoundPage />),
    },
    {
      path: '*',
      element: <Navigate replace to="/404" />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  },
);
