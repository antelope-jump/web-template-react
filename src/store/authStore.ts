import { create } from 'zustand';

import * as authService from '@/services/authService';
import type { LoginPayload, UserProfile } from '@/types/auth';
import {
  clearAuthStorage,
  getProfile,
  getRefreshToken,
  getToken,
  setProfile,
  setRefreshToken,
  setToken,
} from '@/utils/storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: string;
  clearError: () => void;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getToken(),
  refreshToken: getRefreshToken(),
  user: getProfile(),
  loading: false,
  error: '',
  clearError: () => set({ error: '' }),
  login: async (payload) => {
    set({ loading: true, error: '' });
    try {
      const result = await authService.login(payload);
      set({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.profile,
        loading: false,
      });
      setToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setProfile(result.profile);
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
        error: '',
      });
      clearAuthStorage();
    }
  },
}));
