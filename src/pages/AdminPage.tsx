import { Card, Typography } from 'antd';

export function AdminPage() {
  return (
    <Card>
      <Typography.Title level={3}>管理员页面</Typography.Title>
      <Typography.Paragraph>该页面仅允许 admin 角色访问。</Typography.Paragraph>
    </Card>
  );
}
