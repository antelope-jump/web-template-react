export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginPayload {
  username: string;
  password: string;
}
