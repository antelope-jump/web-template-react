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
  {
    path: '/admin/permissions',
    name: '权限管理',
    component: 'PermissionManagementPage',
    roles: ['admin'],
    parentPath: '/admin',
    order: 4,
    permissionCode: 'admin:permission:view',
  },
  {
    path: '/admin/users',
    name: '用户管理',
    component: 'UserManagementPage',
    roles: ['admin'],
    parentPath: '/admin',
    order: 5,
    permissionCode: 'admin:user:view',
  },
  {
    path: '/admin/roles',
    name: '角色管理',
    component: 'RoleManagementPage',
    roles: ['admin'],
    parentPath: '/admin',
    order: 6,
    permissionCode: 'admin:role:view',
  },
  {
    path: '/admin/menus',
    name: '菜单管理',
    component: 'MenuManagementPage',
    roles: ['admin'],
    parentPath: '/admin',
    order: 7,
    permissionCode: 'admin:menu:view',
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
