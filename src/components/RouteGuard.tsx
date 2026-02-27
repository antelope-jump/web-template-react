import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

interface RouteGuardProps {
  roles?: Array<'admin' | 'user'>;
}

export function RouteGuard({ roles }: RouteGuardProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate replace to="/403" />;
  }

  return <Outlet />;
}
