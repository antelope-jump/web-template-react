import { http } from '@/utils/http';
import type { LoginPayload, LoginResult, RefreshTokenResult } from '@/types/auth';

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await http.post<LoginResult>('/auth/login', payload);
  return response.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResult> {
  const response = await http.post<RefreshTokenResult>('/auth/refresh', { refreshToken });
  return response.data;
}

export async function logout(refreshToken: string | null) {
  if (!refreshToken) {
    return;
  }

  await http.post('/auth/logout', { refreshToken });
}
