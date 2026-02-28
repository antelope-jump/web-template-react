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
      authorizedRoutes: [],
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

  it('keeps backend empty routes when login returns an empty array', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: 'access_locked',
      refreshToken: 'refresh_locked',
      profile: { id: '2', name: '受限用户', role: 'user' },
      routes: [],
    });

    const success = await useAuthStore.getState().login({ username: 'locked', password: '123456' });

    expect(success).toBe(true);
    expect(useAuthStore.getState().authorizedRoutes).toEqual([]);
  });

  it('falls back to local role routes when backend routes cannot be fetched', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: 'access_456',
      refreshToken: 'refresh_456',
      profile: { id: '3', name: '普通用户', role: 'user' },
    });
    vi.mocked(authService.getAuthorizedRoutes).mockRejectedValueOnce(new Error('network error'));

    const success = await useAuthStore.getState().login({ username: 'user', password: '123456' });

    expect(success).toBe(true);
    expect(useAuthStore.getState().authorizedRoutes.length).toBeGreaterThan(0);
  });

});
