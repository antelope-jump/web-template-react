export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends AuthTokens {
  profile: UserProfile;
}

export interface RefreshTokenResult {
  accessToken: string;
}
