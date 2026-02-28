import { useEffect, useMemo, useState } from 'react';

import { Button, Card, Select, Space, Table, Tag, Typography, message } from 'antd';

import { Permission } from '@/components/Permission';
import { http } from '@/utils/http';

interface UserItem {
  id: string;
  username: string;
  nickname: string;
  status: 'enabled' | 'disabled';
  roles: string[];
}

interface RoleOption {
  label: string;
  value: string;
}

export function UserManagementPage() {
  const [api, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, roleRes] = await Promise.all([
          http.get<UserItem[]>('/admin/users'),
          http.get<Array<{ id: string; name: string; code: string }>>('/admin/roles'),
        ]);

        setUsers(userRes.data);
        setRoleOptions(roleRes.data.map((item) => ({ label: item.name, value: item.code })));
      } catch (error) {
        api.error(error instanceof Error ? error.message : '加载用户管理数据失败');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [api]);

  const roleOptionMap = useMemo(
    () => new Map(roleOptions.map((item) => [item.value, item.label])),
    [roleOptions],
  );

  const onUpdateRoles = async (userId: string, roles: string[]) => {
    try {
      await http.post('/admin/users/assign-roles', { userId, roles });
      setUsers((prev) => prev.map((item) => (item.id === userId ? { ...item, roles } : item)));
      api.success('角色分配已更新（示例）');
    } catch (error) {
      api.error(error instanceof Error ? error.message : '更新角色失败');
    }
  };

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            用户管理
          </Typography.Title>
          <Permission permission="admin:user:create">
            <Button onClick={() => api.success('已新建用户（示例）')} type="primary">
              新建用户
            </Button>
          </Permission>
        </Space>

        <Table<UserItem>
          columns={[
            { title: '用户名', dataIndex: 'username', key: 'username' },
            { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: UserItem['status']) => (
                <Tag color={status === 'enabled' ? 'green' : 'default'}>
                  {status === 'enabled' ? '启用' : '停用'}
                </Tag>
              ),
            },
            {
              title: '角色分配',
              dataIndex: 'roles',
              key: 'roles',
              render: (roles: string[], record: UserItem) => (
                <Permission permission="admin:user:assign-role" fallback={<Space wrap>{roles.map((r) => <Tag key={r}>{roleOptionMap.get(r) ?? r}</Tag>)}</Space>}>
                  <Select
                    mode="multiple"
                    options={roleOptions}
                    style={{ minWidth: 260 }}
                    value={roles}
                    onChange={(nextRoles) => {
                      void onUpdateRoles(record.id, nextRoles);
                    }}
                  />
                </Permission>
              ),
            },
          ]}
          dataSource={users}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      </Space>
    </Card>
  );
}
