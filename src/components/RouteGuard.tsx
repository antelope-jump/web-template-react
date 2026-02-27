import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  roles?: Array<'admin' | 'user'>;
}

export function RouteGuard({ roles }: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate replace to="/403" />;
  }

  return <Outlet />;
}
