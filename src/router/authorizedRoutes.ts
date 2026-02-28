import type { AuthorizedRoute, UserRole } from '@/types/auth';

const adminRoutes: AuthorizedRoute[] = [
  { path: '/', name: '首页', component: 'HomePage', order: 1, permissionCode: 'home:view' },
  {
    path: '/dashboard',
    name: '仪表盘',
    component: 'DashboardPage',
    order: 2,
    permissionCode: 'dashboard:view',
  },
  {
    path: '/admin',
    name: '管理页（需 admin）',
    component: 'AdminPage',
    roles: ['admin'],
    order: 3,
    permissionCode: 'admin:view',
  },
];

const userRoutes: AuthorizedRoute[] = [
  { path: '/', name: '首页', component: 'HomePage', order: 1, permissionCode: 'home:view' },
  {
    path: '/dashboard',
    name: '仪表盘',
    component: 'DashboardPage',
    order: 2,
    permissionCode: 'dashboard:view',
  },
];

export function getFallbackAuthorizedRoutes(role?: UserRole): AuthorizedRoute[] {
  return role === 'admin' ? adminRoutes : userRoutes;
}
