import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/authStore';
import { clearAuthStorage, getRefreshToken, getToken, setToken } from '@/utils/storage';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const http = axios.create({
  baseURL,
  timeout: 10000,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
});

let refreshingPromise: Promise<string> | null = null;

const AUTH_ENDPOINTS = new Set(['/auth/login', '/auth/refresh']);

function shouldSkipRefresh(url?: string) {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.split('?')[0];
  return [...AUTH_ENDPOINTS].some((endpoint) => normalizedUrl.endsWith(endpoint));
}

async function refreshToken() {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    throw new Error('登录已过期，请重新登录');
  }

  const response = await refreshClient.post<RefreshResponse>('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });

  const nextAccessToken = response.data.accessToken;
  setToken(nextAccessToken);
  return nextAccessToken;
}

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401
      && config
      && !config._retry
      && !shouldSkipRefresh(config.url)
    ) {
      config._retry = true;

      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshToken().finally(() => {
            refreshingPromise = null;
          });
        }

        const nextAccessToken = await refreshingPromise;
        config.headers.Authorization = `Bearer ${nextAccessToken}`;
        return http(config);
      } catch {
        useAuthStore.setState({
          accessToken: null,
          refreshToken: null,
          user: null,
          error: '',
        });
        clearAuthStorage();
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }
    }

    const message = error.response?.data?.message || error.message || '请求失败，请稍后重试';
    return Promise.reject(new Error(message));
  },
);
