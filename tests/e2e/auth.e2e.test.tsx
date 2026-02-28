import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';

vi.mock('@/services/authService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getAuthorizedRoutes: vi.fn(),
}));

import * as authService from '@/services/authService';

describe('auth e2e', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/login');
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('allows login and redirects to home', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: 'a1',
      refreshToken: 'r1',
      profile: {
        id: '1',
        name: '系统管理员',
        role: 'admin',
        dataScope: 'ALL',
        permissions: [
          'home:view',
          'dashboard:view',
          'admin:view',
          'admin:user:view',
          'admin:permission:view',
          'admin:role:view',
          'admin:menu:view',
        ],
      },
    });
    vi.mocked(authService.getAuthorizedRoutes).mockResolvedValueOnce([
      { path: '/', name: '首页', component: 'HomePage' },
      { path: '/dashboard', name: '仪表盘', component: 'DashboardPage' },
      { path: '/admin', name: '管理页（需 admin）', component: 'AdminPage', roles: ['admin'] },
      {
        path: '/admin/users',
        name: '用户管理',
        component: 'UserManagementPage',
        roles: ['admin'],
      },
      {
        path: '/admin/permissions',
        name: '权限管理',
        component: 'PermissionManagementPage',
        roles: ['admin'],
      },
      {
        path: '/admin/roles',
        name: '角色管理',
        component: 'RoleManagementPage',
        roles: ['admin'],
      },
      {
        path: '/admin/menus',
        name: '菜单管理',
        component: 'MenuManagementPage',
        roles: ['admin'],
      },
    ]);

    const container = document.getElementById('root')!;
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    let inputs = container.querySelectorAll('input');
    for (let i = 0; i < 20 && inputs.length < 2; i += 1) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });
      inputs = container.querySelectorAll('input');
    }

    const usernameInput = inputs[0]!;
    const passwordInput = inputs[1]!;

    await act(async () => {
      usernameInput.value = 'admin';
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.value = '123456';
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    for (let i = 0; i < 20 && !container.textContent?.includes('React 基础框架'); i += 1) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });
    }

    expect(container.textContent).toContain('React Starter');
    expect(container.textContent).toContain('React 基础框架');
    expect(container.textContent).toContain('用户管理');
    expect(container.textContent).toContain('权限管理');
    expect(container.textContent).toContain('角色管理');
    expect(container.textContent).toContain('菜单管理');
    expect(container.textContent).toContain('当前用户：系统管理员（admin）');
    root.unmount();
  });
});
