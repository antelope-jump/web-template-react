import { Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

const menus = [
  { key: '/', label: <Link to="/">首页</Link> },
  { key: '/dashboard', label: <Link to="/dashboard">仪表盘</Link> },
  { key: '/admin', label: <Link to="/admin">管理页（需 admin）</Link> },
];

export function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          <Link style={{ color: '#fff' }} to="/">
            React Starter
          </Link>
        </Typography.Title>
        <Menu
          items={menus}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 360 }}
          theme="dark"
        />
        <Space>
          <Tag color="blue">当前用户：{user?.name ?? '-'}（{user?.role ?? '-'}）</Tag>
          <Button onClick={handleLogout}>退出登录</Button>
        </Space>
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
