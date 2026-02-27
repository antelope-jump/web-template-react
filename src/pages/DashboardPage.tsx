import { Card, Typography } from 'antd';

import { http } from '@/utils/http';

export function DashboardPage() {
  return (
    <Card>
      <Typography.Title level={3}>业务仪表盘</Typography.Title>
      <Typography.Paragraph>可在此扩展图表、统计卡片、表格等业务模块。</Typography.Paragraph>
      <Typography.Paragraph>
        示例 API 实例 baseURL：<code>{http.defaults.baseURL}</code>
      </Typography.Paragraph>
    </Card>
  );
}
