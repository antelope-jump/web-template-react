import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { UserProfile } from '@/types/auth';

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function setToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.accessToken, token);
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
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
