export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

export type UserRole = UserProfile['role'];

export interface AuthorizedRoute {
  path: string;
  name: string;
  component: 'HomePage' | 'DashboardPage' | 'AdminPage';
  roles?: UserRole[];
  hidden?: boolean;
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
  routes?: AuthorizedRoute[];
}

export interface RefreshTokenResult {
  accessToken: string;
}
