import { useEffect, useState } from 'react';

import { Button, Card, Modal, Space, Table, Tag, TreeSelect, Typography, message } from 'antd';
import type { TreeSelectProps } from 'antd';

import { Permission } from '@/components/Permission';
import { http } from '@/utils/http';

interface RoleItem {
  id: string;
  name: string;
  code: string;
  userCount: number;
  status: 'enabled' | 'disabled';
}

interface MenuNode {
  id: string;
  name: string;
  type: 'MENU' | 'BUTTON';
  parentId?: string | null;
}

interface MenuTreeNode {
  title: string;
  value: string;
  key: string;
  children: MenuTreeNode[];
}

interface RoleMenuRelation {
  roleCode: string;
  menuIds: string[];
}

export function RoleManagementPage() {
  const [api, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RoleItem[]>([]);
  const [menuTreeData, setMenuTreeData] = useState<TreeSelectProps['treeData']>([]);
  const [roleMenuMap, setRoleMenuMap] = useState<Record<string, string[]>>({});
  const [assigningRole, setAssigningRole] = useState<RoleItem | null>(null);
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);

  const buildMenuTreeData = (menus: MenuNode[]): TreeSelectProps['treeData'] => {
    const nodeMap = new Map<string, MenuTreeNode>();

    menus
      .filter((menu) => menu.type === 'MENU')
      .forEach((menu) => {
        nodeMap.set(menu.id, {
          title: menu.name,
          value: menu.id,
          key: menu.id,
          children: [],
        });
      });

    const roots: MenuTreeNode[] = [];

    menus
      .filter((menu) => menu.type === 'MENU')
      .forEach((menu) => {
        const node = nodeMap.get(menu.id);
        if (!node) {
          return;
        }

        if (menu.parentId && nodeMap.has(menu.parentId)) {
          nodeMap.get(menu.parentId)!.children.push(node);
        } else {
          roots.push(node);
        }
      });

    return roots;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const [roleRes, menuRes, relationRes] = await Promise.all([
          http.get<RoleItem[]>('/admin/roles'),
          http.get<MenuNode[]>('/admin/menus'),
          http.get<RoleMenuRelation[]>('/admin/role-menus'),
        ]);

        setItems(roleRes.data);
        setMenuTreeData(buildMenuTreeData(menuRes.data));
        setRoleMenuMap(
          relationRes.data.reduce<Record<string, string[]>>((acc, curr) => {
            acc[curr.roleCode] = curr.menuIds;
            return acc;
          }, {}),
        );
      } catch (error) {
        api.error(error instanceof Error ? error.message : '加载角色列表失败');
      } finally {
        setLoading(false);
      }
    };

    void fetchRoles();
  }, [api]);

  const openAssignModal = (role: RoleItem) => {
    setAssigningRole(role);
    setSelectedMenuIds(roleMenuMap[role.code] ?? []);
  };

  const submitAssignMenus = async () => {
    if (!assigningRole) {
      return;
    }

    try {
      await http.post('/admin/roles/assign-menus', {
        roleCode: assigningRole.code,
        menuIds: selectedMenuIds,
      });
      setRoleMenuMap((prev) => ({
        ...prev,
        [assigningRole.code]: selectedMenuIds,
      }));
      api.success(`已为角色 ${assigningRole.name} 更新菜单权限（示例）`);
      setAssigningRole(null);
    } catch (error) {
      api.error(error instanceof Error ? error.message : '更新角色菜单权限失败');
    }
  };

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            角色管理
          </Typography.Title>
          <Permission permission="admin:role:create">
            <Button onClick={() => api.success('已新建角色（示例）')} type="primary">
              新建角色
            </Button>
          </Permission>
        </Space>

        <Table<RoleItem>
          columns={[
            { title: '角色名称', dataIndex: 'name', key: 'name' },
            { title: '角色编码', dataIndex: 'code', key: 'code' },
            { title: '关联用户数', dataIndex: 'userCount', key: 'userCount' },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: RoleItem['status']) => (
                <Tag color={status === 'enabled' ? 'green' : 'default'}>
                  {status === 'enabled' ? '启用' : '停用'}
                </Tag>
              ),
            },
            {
              title: '菜单权限',
              key: 'menuPermissions',
              render: (_, record) => {
                const menuCount = roleMenuMap[record.code]?.length ?? 0;
                return (
                  <Permission permission="admin:role:assign-menu">
                    <Button onClick={() => openAssignModal(record)} type="link">
                      分配菜单（{menuCount}）
                    </Button>
                  </Permission>
                );
              },
            },
          ]}
          dataSource={items}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      </Space>

      <Modal
        cancelText="取消"
        okText="保存"
        onCancel={() => setAssigningRole(null)}
        onOk={() => {
          void submitAssignMenus();
        }}
        open={Boolean(assigningRole)}
        title={`菜单权限分配 - ${assigningRole?.name ?? ''}`}
      >
        <Typography.Paragraph type="secondary">
          参考若依角色菜单分配：为角色配置可访问菜单。
        </Typography.Paragraph>
        <TreeSelect
          onChange={(values) => setSelectedMenuIds(values as string[])}
          placeholder="请选择该角色可访问的菜单"
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          style={{ width: '100%' }}
          treeCheckable
          treeData={menuTreeData}
          value={selectedMenuIds}
        />
      </Modal>
    </Card>
  );
}
