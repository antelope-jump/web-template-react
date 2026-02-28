import { Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

interface RouteMenuNode {
  key: string;
  label: ReactNode;
  parentPath?: string;
  order: number;
  children: RouteMenuNode[];
}

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

  const routeNodes = new Map<string, RouteMenuNode>();

  authorizedRoutes
    .filter(
      (route) =>
        !route.hidden && (!route.permissionCode || hasPermission(route.permissionCode)),
    )
    .forEach((route) => {
      routeNodes.set(route.path, {
        key: route.path,
        label: <Link to={route.path}>{route.name}</Link>,
        parentPath: route.parentPath,
        order: route.order ?? 0,
        children: [],
      });
    });

  const rootNodes: RouteMenuNode[] = [];

  routeNodes.forEach((node) => {
    if (node.parentPath && routeNodes.has(node.parentPath)) {
      routeNodes.get(node.parentPath)!.children.push(node);
      return;
    }

    rootNodes.push(node);
  });

  const toMenuItems = (nodes: RouteMenuNode[]): ItemType[] =>
    nodes
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        key: node.key,
        label: node.label,
        children: node.children.length > 0 ? toMenuItems(node.children) : undefined,
      }));

  const menus = toMenuItems(rootNodes);

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
