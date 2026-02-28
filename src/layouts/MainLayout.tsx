import { Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

export function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const authorizedRoutes = useAuthStore((state) => state.authorizedRoutes);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menus: ItemType[] = authorizedRoutes
    .filter(
      (route) =>
        !route.hidden && (!route.permissionCode || hasPermission(route.permissionCode)),
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((route) => ({
      key: route.path,
      label: <Link to={route.path}>{route.name}</Link>,
    }));

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
          <Tag color="purple">数据范围：{user?.dataScope ?? '-'}</Tag>
          <Button onClick={handleLogout}>退出登录</Button>
        </Space>
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
