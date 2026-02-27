import { Button, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Card>
      <Typography.Title level={3}>404 页面不存在</Typography.Title>
      <Typography.Paragraph>请检查访问路径是否正确。</Typography.Paragraph>
      <Button type="primary">
        <Link to="/">返回首页</Link>
      </Button>
    </Card>
  );
}
