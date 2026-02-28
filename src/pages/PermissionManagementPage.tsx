import { useEffect, useState } from 'react';

import { Card, Space, Table, Tag, Typography, message } from 'antd';

import { http } from '@/utils/http';

interface PermissionItem {
  id: string;
  module: string;
  name: string;
  code: string;
  status: 'enabled' | 'disabled';
}

interface RolePermissionItem {
  id: string;
  roleName: string;
  roleCode: string;
  permissions: string[];
}

export function PermissionManagementPage() {
  const [api, contextHolder] = message.useMessage();
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [roleMatrix, setRoleMatrix] = useState<RolePermissionItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setPermissionLoading(true);
      setMatrixLoading(true);
      try {
        const [permissionRes, matrixRes] = await Promise.all([
          http.get<PermissionItem[]>('/admin/permissions'),
          http.get<RolePermissionItem[]>('/admin/role-permissions'),
        ]);
        setPermissions(permissionRes.data);
        setRoleMatrix(matrixRes.data);
      } catch (error) {
        api.error(error instanceof Error ? error.message : '加载权限管理数据失败');
      } finally {
        setPermissionLoading(false);
        setMatrixLoading(false);
      }
    };

    void fetchData();
  }, [api]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {contextHolder}
      <Card>
        <Typography.Title level={3}>权限管理</Typography.Title>
        <Typography.Paragraph type="secondary">
          参考若依模型：维护权限点（Permission Code）并查看角色-权限映射。
        </Typography.Paragraph>
      </Card>

      <Card title="权限点列表">
        <Table<PermissionItem>
          columns={[
            { title: '模块', dataIndex: 'module', key: 'module' },
            { title: '权限名称', dataIndex: 'name', key: 'name' },
            {
              title: '权限标识',
              dataIndex: 'code',
              key: 'code',
              render: (code: string) => <Typography.Text code>{code}</Typography.Text>,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: PermissionItem['status']) => (
                <Tag color={status === 'enabled' ? 'green' : 'default'}>
                  {status === 'enabled' ? '启用' : '停用'}
                </Tag>
              ),
            },
          ]}
          dataSource={permissions}
          loading={permissionLoading}
          pagination={false}
          rowKey="id"
        />
      </Card>

      <Card title="角色-权限映射">
        <Table<RolePermissionItem>
          columns={[
            { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
            { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode' },
            {
              title: '权限集合',
              dataIndex: 'permissions',
              key: 'permissions',
              render: (items: string[]) => (
                <Space size={[0, 8]} wrap>
                  {items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </Space>
              ),
            },
          ]}
          dataSource={roleMatrix}
          loading={matrixLoading}
          pagination={false}
          rowKey="id"
        />
      </Card>
    </Space>
  );
}
