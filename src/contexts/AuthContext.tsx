import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import * as authService from '@/services/authService';
import type { LoginPayload, UserProfile } from '@/types/auth';
import {
  clearProfile,
  clearToken,
  getProfile,
  getToken,
  setProfile,
  setToken,
} from '@/utils/storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setAuthToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<UserProfile | null>(() => getProfile());

  const login = useCallback(async (payload: LoginPayload) => {
    const { token: nextToken, profile } = await authService.login(payload);
    setAuthToken(nextToken);
    setUser(profile);
    setToken(nextToken);
    setProfile(profile);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAuthToken(null);
    setUser(null);
    clearToken();
    clearProfile();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      login,
      logout,
    }),
    [token, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
}
