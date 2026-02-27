import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const login = useAuthStore((state) => state.login);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

  const onSubmit = async (values: LoginForm) => {
    clearError();

    const success = await login(values);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Typography.Title level={3}>登录</Typography.Title>
        <Typography.Paragraph type="secondary">
          已接入真实后端接口：/auth/login + /auth/refresh
        </Typography.Paragraph>
        <Form<LoginForm>
          initialValues={{ username: 'admin', password: '123456' }}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          {error ? <Alert message={error} style={{ marginBottom: 16 }} type="error" /> : null}
          <Button block htmlType="submit" loading={loading} type="primary">
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
