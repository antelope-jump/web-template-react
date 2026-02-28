import { create } from 'zustand';

import { getFallbackAuthorizedRoutes } from '@/router/authorizedRoutes';
import * as authService from '@/services/authService';
import type { AuthorizedRoute, LoginPayload, UserProfile } from '@/types/auth';
import {
  getAuthorizedRoutes,
  clearAuthStorage,
  getProfile,
  getRefreshToken,
  getToken,
  setAuthorizedRoutes,
  setProfile,
  setRefreshToken,
  setToken,
} from '@/utils/storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  authorizedRoutes: AuthorizedRoute[];
  loading: boolean;
  error: string;
  clearError: () => void;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

const initialUser = getProfile();
const storedRoutes = getAuthorizedRoutes();
const initialRoutes =
  storedRoutes.length > 0 ? storedRoutes : getFallbackAuthorizedRoutes(initialUser?.role);

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getToken(),
  refreshToken: getRefreshToken(),
  user: initialUser,
  authorizedRoutes: initialRoutes,
  loading: false,
  error: '',
  clearError: () => set({ error: '' }),
  login: async (payload) => {
    set({ loading: true, error: '' });
    try {
      const result = await authService.login(payload);
      const authorizedRoutes =
        result.routes ?? (await authService.getAuthorizedRoutes().catch(() => []));
      const safeRoutes =
        authorizedRoutes.length > 0
          ? authorizedRoutes
          : getFallbackAuthorizedRoutes(result.profile.role);

      set({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.profile,
        authorizedRoutes: safeRoutes,
        loading: false,
      });
      setToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setProfile(result.profile);
      setAuthorizedRoutes(safeRoutes);
      return true;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '登录失败',
      });
      return false;
    }
  },
  logout: async () => {
    try {
      await authService.logout(get().refreshToken);
    } finally {
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        authorizedRoutes: [],
        error: '',
      });
      clearAuthStorage();
    }
  },
}));
