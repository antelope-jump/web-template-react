import type { LoginPayload, UserProfile } from '@/types/auth';

interface LoginResult {
  token: string;
  profile: UserProfile;
}

const MOCK_USERS = {
  admin: {
    password: '123456',
    profile: { id: '1', name: '系统管理员', role: 'admin' as const },
  },
  user: {
    password: '123456',
    profile: { id: '2', name: '普通用户', role: 'user' as const },
  },
};

export async function login(payload: LoginPayload): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const account = MOCK_USERS[payload.username as keyof typeof MOCK_USERS];
  if (!account || account.password !== payload.password) {
    throw new Error('用户名或密码错误（可使用 admin/123456）');
  }

  return {
    token: `mock_token_${payload.username}`,
    profile: account.profile,
  };
}

export async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 120));
}
