import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { AuthorizedRoute, UserProfile } from '@/types/auth';

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function setToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.accessToken, token);
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function setRefreshToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.refreshToken, token);
}

export function clearRefreshToken() {
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
}

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(STORAGE_KEYS.userProfile);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export function setProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEYS.userProfile);
}

export function getAuthorizedRoutes(): AuthorizedRoute[] {
  const raw = localStorage.getItem(STORAGE_KEYS.authorizedRoutes);
  return raw ? (JSON.parse(raw) as AuthorizedRoute[]) : [];
}

export function setAuthorizedRoutes(routes: AuthorizedRoute[]) {
  localStorage.setItem(STORAGE_KEYS.authorizedRoutes, JSON.stringify(routes));
}

export function clearAuthorizedRoutes() {
  localStorage.removeItem(STORAGE_KEYS.authorizedRoutes);
}

export function clearAuthStorage() {
  clearToken();
  clearRefreshToken();
  clearProfile();
  clearAuthorizedRoutes();
}
