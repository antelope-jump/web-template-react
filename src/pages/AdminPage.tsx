import { Button, Card, Space, Typography, message } from 'antd';

import { Permission } from '@/components/Permission';

export function AdminPage() {
  const [api, contextHolder] = message.useMessage();

  return (
    <Card>
      {contextHolder}
      <Typography.Title level={3}>管理员页面</Typography.Title>
      <Typography.Paragraph>该页面仅允许 admin 角色访问。</Typography.Paragraph>
      <Space>
        <Permission permission="admin:user:create">
          <Button onClick={() => api.success('已创建用户（示例）')} type="primary">
            新建用户
          </Button>
        </Permission>
        <Permission permission="admin:user:delete">
          <Button danger onClick={() => api.warning('已删除用户（示例）')}>
            删除用户
          </Button>
        </Permission>
      </Space>
    </Card>
  );
}
