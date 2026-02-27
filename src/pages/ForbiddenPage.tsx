import { Button, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <Card>
      <Typography.Title level={3}>403 无权限访问</Typography.Title>
      <Typography.Paragraph>你当前角色无权访问该页面，请联系管理员。</Typography.Paragraph>
      <Button type="primary">
        <Link to="/">返回首页</Link>
      </Button>
    </Card>
  );
}
