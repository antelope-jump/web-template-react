import { useEffect, useMemo, useState } from 'react';

import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';

import { Permission } from '@/components/Permission';
import { http } from '@/utils/http';

interface MenuItem {
  id: string;
  name: string;
  path: string;
  type: 'MENU' | 'BUTTON';
  permissionCode: string;
  status: 'enabled' | 'disabled';
  parentId?: string | null;
}

interface MenuFormValues {
  name: string;
  path: string;
  type: 'MENU' | 'BUTTON';
  permissionCode: string;
  parentId?: string;
}

export function MenuManagementPage() {
  const [api, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<MenuFormValues>();

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response = await http.get<MenuItem[]>('/admin/menus');
        setItems(response.data);
      } catch (error) {
        api.error(error instanceof Error ? error.message : '加载菜单列表失败');
      } finally {
        setLoading(false);
      }
    };

    void fetchMenus();
  }, [api]);

  const menuNameMap = useMemo(() => {
    return items.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, [items]);

  const parentOptions = useMemo(
    () => items.filter((item) => item.type === 'MENU').map((item) => ({ label: item.name, value: item.id })),
    [items],
  );

  const onSubmitCreate = async () => {
    try {
      const values = await form.validateFields();
      const response = await http.post<MenuItem>('/admin/menus', values);
      setItems((prev) => [...prev, response.data]);
      setOpen(false);
      form.resetFields();
      api.success('菜单已创建（示例）');
    } catch (error) {
      if (error instanceof Error) {
        api.error(error.message);
      }
    }
  };

  return (
    <Card>
      {contextHolder}
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            菜单管理
          </Typography.Title>
          <Permission permission="admin:menu:create">
            <Button
              onClick={() => {
                setOpen(true);
              }}
              type="primary"
            >
              新建菜单
            </Button>
          </Permission>
        </Space>

        <Table<MenuItem>
          columns={[
            { title: '菜单名称', dataIndex: 'name', key: 'name' },
            {
              title: '父级菜单',
              dataIndex: 'parentId',
              key: 'parentId',
              render: (parentId?: string | null) => (parentId ? menuNameMap[parentId] ?? '-' : '顶级菜单'),
            },
            { title: '路由路径', dataIndex: 'path', key: 'path' },
            {
              title: '类型',
              dataIndex: 'type',
              key: 'type',
              render: (type: MenuItem['type']) => (
                <Tag color={type === 'MENU' ? 'blue' : 'purple'}>{type}</Tag>
              ),
            },
            { title: '权限标识', dataIndex: 'permissionCode', key: 'permissionCode' },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: MenuItem['status']) => (
                <Tag color={status === 'enabled' ? 'green' : 'default'}>
                  {status === 'enabled' ? '启用' : '停用'}
                </Tag>
              ),
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
        onCancel={() => setOpen(false)}
        onOk={() => {
          void onSubmitCreate();
        }}
        open={open}
        title="新建菜单"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="菜单名称" name="name" rules={[{ required: true, message: '请输入菜单名称' }]}>
            <Input placeholder="例如：系统设置" />
          </Form.Item>
          <Form.Item label="菜单类型" name="type" rules={[{ required: true, message: '请选择菜单类型' }]}>
            <Select
              options={[
                { label: '菜单', value: 'MENU' },
                { label: '按钮', value: 'BUTTON' },
              ]}
              placeholder="请选择菜单类型"
            />
          </Form.Item>
          <Form.Item label="父级菜单" name="parentId">
            <Select allowClear options={parentOptions} placeholder="可选，默认顶级菜单" />
          </Form.Item>
          <Form.Item label="路由路径" name="path" rules={[{ required: true, message: '请输入路径' }]}>
            <Input placeholder="例如：/admin/settings" />
          </Form.Item>
          <Form.Item
            label="权限标识"
            name="permissionCode"
            rules={[{ required: true, message: '请输入权限标识' }]}
          >
            <Input placeholder="例如：admin:settings:view" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
