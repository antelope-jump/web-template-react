import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';

vi.mock('@/services/authService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}));

import * as authService from '@/services/authService';

describe('auth e2e', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/login');
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('allows login and redirects to home', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: 'a1',
      refreshToken: 'r1',
      profile: { id: '1', name: '系统管理员', role: 'admin' },
    });

    const container = document.getElementById('root')!;
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    const inputs = container.querySelectorAll('input');
    const usernameInput = inputs[0]!;
    const passwordInput = inputs[1]!;

    await act(async () => {
      usernameInput.value = 'admin';
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.value = '123456';
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const submitButton = Array.from(container.querySelectorAll('button')).find(
      (item) => item.textContent?.trim() === '登录',
    ) as HTMLButtonElement;

    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('React 基础框架');
    expect(container.textContent).toContain('当前用户：系统管理员（admin）');
    root.unmount();
  });
});
