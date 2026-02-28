import type { IncomingMessage, ServerResponse } from 'node:http';

import type { Plugin } from 'vite';

interface MockUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  dataScope: 'SELF' | 'DEPT' | 'ALL';
  permissions: string[];
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'admin',
    password: '123456',
    name: '系统管理员',
    role: 'admin',
    dataScope: 'ALL',
    permissions: [
      'home:view',
      'dashboard:view',
      'dashboard:export',
      'admin:view',
      'admin:user:view',
      'admin:user:assign-role',
      'admin:permission:view',
      'admin:role:view',
      'admin:menu:view',
      'admin:permission:create',
      'admin:role:create',
      'admin:role:assign-menu',
      'admin:menu:create',
      'admin:user:create',
      'admin:user:delete',
    ],
  },
  {
    id: '2',
    username: 'user',
    password: '123456',
    name: '普通用户',
    role: 'user',
    dataScope: 'SELF',
    permissions: ['home:view', 'dashboard:view'],
  },
];

const mockRoutesByRole = {
  admin: [
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
  ],
  user: [
    { path: '/', name: '首页', component: 'HomePage', order: 1, permissionCode: 'home:view' },
    {
      path: '/dashboard',
      name: '仪表盘',
      component: 'DashboardPage',
      order: 2,
      permissionCode: 'dashboard:view',
    },
  ],
} as const;

let mockMenus = [
  {
    id: 'm1',
    name: '首页',
    path: '/',
    type: 'MENU',
    permissionCode: 'home:view',
    status: 'enabled',
    parentId: null,
  },
  {
    id: 'm2',
    name: '用户管理',
    path: '/admin/users',
    type: 'MENU',
    permissionCode: 'admin:user:view',
    status: 'enabled',
    parentId: null,
  },
  {
    id: 'm3',
    name: '权限管理',
    path: '/admin/permissions',
    type: 'MENU',
    permissionCode: 'admin:permission:view',
    status: 'enabled',
    parentId: 'm2',
  },
  {
    id: 'm4',
    name: '角色管理',
    path: '/admin/roles',
    type: 'MENU',
    permissionCode: 'admin:role:view',
    status: 'enabled',
    parentId: 'm2',
  },
  {
    id: 'm5',
    name: '菜单管理',
    path: '/admin/menus',
    type: 'MENU',
    permissionCode: 'admin:menu:view',
    status: 'enabled',
    parentId: 'm2',
  },
  {
    id: 'm6',
    name: '角色新增按钮',
    path: 'button:createRole',
    type: 'BUTTON',
    permissionCode: 'admin:role:create',
    status: 'enabled',
    parentId: 'm4',
  },
];

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({} as T);
        return;
      }

      try {
        resolve(JSON.parse(raw) as T);
      } catch {
        reject(new Error('请求体 JSON 解析失败'));
      }
    });
    req.on('error', reject);
  });
}

function getRoleFromAuthHeader(authorization?: string) {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice('Bearer '.length);
  if (token.includes('_admin_')) {
    return 'admin' as const;
  }
  if (token.includes('_user_')) {
    return 'user' as const;
  }

  return null;
}

export function createDevMockApiPlugin(): Plugin {
  return {
    name: 'dev-mock-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const method = req.method || 'GET';
        const reqUrl = req.url || '/';
        const url = new URL(reqUrl, 'http://127.0.0.1');
        const { pathname } = url;

        try {
          if (method === 'POST' && pathname === '/auth/login') {
            const payload = await readJsonBody<{ username?: string; password?: string }>(req);
            const user = mockUsers.find(
              (item) => item.username === payload.username && item.password === payload.password,
            );

            if (!user) {
              sendJson(res, 401, { message: '用户名或密码错误' });
              return;
            }

            const ts = Date.now();
            sendJson(res, 200, {
              accessToken: `mock_access_${user.role}_${ts}`,
              refreshToken: `mock_refresh_${user.role}_${ts}`,
              profile: {
                id: user.id,
                name: user.name,
                role: user.role,
                dataScope: user.dataScope,
                permissions: user.permissions,
              },
              routes: mockRoutesByRole[user.role],
            });
            return;
          }

          if (method === 'POST' && pathname === '/auth/refresh') {
            const payload = await readJsonBody<{ refreshToken?: string }>(req);
            const role = payload.refreshToken?.includes('_admin_') ? 'admin' : 'user';
            sendJson(res, 200, {
              accessToken: `mock_access_${role}_${Date.now()}`,
            });
            return;
          }

          if (method === 'POST' && pathname === '/auth/logout') {
            sendJson(res, 200, { success: true });
            return;
          }

          if (method === 'GET' && pathname === '/auth/routes') {
            const role = getRoleFromAuthHeader(req.headers.authorization);
            if (!role) {
              sendJson(res, 401, { message: '未授权' });
              return;
            }

            sendJson(res, 200, mockRoutesByRole[role]);
            return;
          }

          if (method === 'GET' && pathname === '/admin/roles') {
            sendJson(res, 200, [
              { id: 'r1', name: '系统管理员', code: 'admin', userCount: 2, status: 'enabled' },
              { id: 'r2', name: '普通用户', code: 'user', userCount: 18, status: 'enabled' },
              { id: 'r3', name: '审计员', code: 'auditor', userCount: 1, status: 'disabled' },
            ]);
            return;
          }

          if (method === 'GET' && pathname === '/admin/role-menus') {
            sendJson(res, 200, [
              { roleCode: 'admin', menuIds: ['m1', 'm2', 'm3', 'm4', 'm5'] },
              { roleCode: 'user', menuIds: ['m1'] },
              { roleCode: 'auditor', menuIds: ['m1', 'm3'] },
            ]);
            return;
          }

          if (method === 'POST' && pathname === '/admin/roles/assign-menus') {
            const payload = await readJsonBody<{ roleCode?: string; menuIds?: string[] }>(req);
            sendJson(res, 200, {
              success: true,
              roleCode: payload.roleCode,
              menuIds: payload.menuIds ?? [],
            });
            return;
          }

          if (method === 'GET' && pathname === '/admin/users') {
            sendJson(res, 200, [
              {
                id: 'u1',
                username: 'admin',
                nickname: '系统管理员',
                status: 'enabled',
                roles: ['admin'],
              },
              {
                id: 'u2',
                username: 'zhangsan',
                nickname: '张三',
                status: 'enabled',
                roles: ['user'],
              },
              {
                id: 'u3',
                username: 'lisi',
                nickname: '李四',
                status: 'disabled',
                roles: ['auditor'],
              },
            ]);
            return;
          }

          if (method === 'POST' && pathname === '/admin/users/assign-roles') {
            const payload = await readJsonBody<{ userId?: string; roles?: string[] }>(req);
            sendJson(res, 200, {
              success: true,
              userId: payload.userId,
              roles: payload.roles ?? [],
            });
            return;
          }

          if (method === 'POST' && pathname === '/admin/menus') {
            const payload = await readJsonBody<{
              name?: string;
              path?: string;
              type?: 'MENU' | 'BUTTON';
              permissionCode?: string;
              parentId?: string;
            }>(req);

            const created = {
              id: `m${mockMenus.length + 1}`,
              name: payload.name ?? '未命名菜单',
              path: payload.path ?? '',
              type: payload.type ?? 'MENU',
              permissionCode: payload.permissionCode ?? '',
              status: 'enabled' as const,
              parentId: payload.parentId ?? null,
            };

            mockMenus = [...mockMenus, created];
            sendJson(res, 200, created);
            return;
          }

          if (method === 'GET' && pathname === '/admin/permissions') {
            sendJson(res, 200, [
              {
                id: 'p1',
                module: '系统管理',
                name: '权限管理-查看',
                code: 'admin:permission:view',
                status: 'enabled',
              },
              {
                id: 'p2',
                module: '系统管理',
                name: '角色管理-查看',
                code: 'admin:role:view',
                status: 'enabled',
              },
              {
                id: 'p3',
                module: '系统管理',
                name: '菜单管理-查看',
                code: 'admin:menu:view',
                status: 'enabled',
              },
              {
                id: 'p4',
                module: '仪表盘',
                name: '报表导出',
                code: 'dashboard:export',
                status: 'enabled',
              },
            ]);
            return;
          }

          if (method === 'GET' && pathname === '/admin/role-permissions') {
            sendJson(res, 200, [
              {
                id: 'rp1',
                roleName: '系统管理员',
                roleCode: 'admin',
                permissions: [
                  'admin:user:view',
                  'admin:user:assign-role',
                  'admin:permission:view',
                  'admin:role:view',
                  'admin:role:assign-menu',
                  'admin:menu:view',
                  'dashboard:export',
                ],
              },
              {
                id: 'rp2',
                roleName: '普通用户',
                roleCode: 'user',
                permissions: ['home:view', 'dashboard:view'],
              },
            ]);
            return;
          }

          if (method === 'GET' && pathname === '/admin/menus') {
            sendJson(res, 200, mockMenus);
            return;
          }
        } catch (error) {
          sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Mock 请求处理失败',
          });
          return;
        }

        next();
      });
    },
  };
}
