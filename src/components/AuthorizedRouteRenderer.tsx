import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

const pageComponentMap = {
  HomePage: lazy(async () => ({ default: (await import('@/pages/HomePage')).HomePage })),
  DashboardPage: lazy(async () => ({ default: (await import('@/pages/DashboardPage')).DashboardPage })),
  AdminPage: lazy(async () => ({ default: (await import('@/pages/AdminPage')).AdminPage })),
};

function normalizePathname(pathname: string) {
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function AuthorizedRouteRenderer() {
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const user = useAuthStore((state) => state.user);
  const authorizedRoutes = useAuthStore((state) => state.authorizedRoutes);

  const matchedRoute = authorizedRoutes.find((route) => route.path === pathname);

  if (!matchedRoute) {
    return <Navigate replace to="/404" />;
  }

  if (matchedRoute.roles && (!user || !matchedRoute.roles.includes(user.role))) {
    return <Navigate replace to="/403" />;
  }

  const Component = pageComponentMap[matchedRoute.component];

  return (
    <Suspense
      fallback={
        <div style={{ display: 'grid', minHeight: 180, placeItems: 'center' }}>
          <Spin />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
