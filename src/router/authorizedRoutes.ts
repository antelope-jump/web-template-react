import type { AuthorizedRoute, UserRole } from '@/types/auth';

const adminRoutes: AuthorizedRoute[] = [
  { path: '/', name: '首页', component: 'HomePage' },
  { path: '/dashboard', name: '仪表盘', component: 'DashboardPage' },
  { path: '/admin', name: '管理页（需 admin）', component: 'AdminPage', roles: ['admin'] },
];

const userRoutes: AuthorizedRoute[] = [
  { path: '/', name: '首页', component: 'HomePage' },
  { path: '/dashboard', name: '仪表盘', component: 'DashboardPage' },
];

export function getFallbackAuthorizedRoutes(role?: UserRole): AuthorizedRoute[] {
  return role === 'admin' ? adminRoutes : userRoutes;
}
