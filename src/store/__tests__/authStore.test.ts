import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/store/authStore';

vi.mock('@/services/authService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getAuthorizedRoutes: vi.fn(),
}));

import * as authService from '@/services/authService';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      loading: false,
      error: '',
    });
  });

  it('stores token/profile on login success', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: 'access_123',
      refreshToken: 'refresh_123',
      profile: {
        id: '1',
        name: '管理员',
        role: 'admin',
        dataScope: 'ALL',
        permissions: ['admin:view'],
      },
    });
    vi.mocked(authService.getAuthorizedRoutes).mockResolvedValueOnce([
      { path: '/', name: '首页', component: 'HomePage' },
    ]);

    const success = await useAuthStore.getState().login({ username: 'admin', password: '123456' });

    expect(success).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe('access_123');
    expect(useAuthStore.getState().refreshToken).toBe('refresh_123');
    expect(useAuthStore.getState().user?.role).toBe('admin');
    expect(useAuthStore.getState().hasPermission('admin:view')).toBe(true);
    expect(useAuthStore.getState().authorizedRoutes).toHaveLength(1);
  });
});
