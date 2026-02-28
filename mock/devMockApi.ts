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
