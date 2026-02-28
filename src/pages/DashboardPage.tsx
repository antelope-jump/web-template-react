import { Button, Card, Space, Typography, message } from 'antd';

import { Permission } from '@/components/Permission';
import { http } from '@/utils/http';

export function DashboardPage() {
  const [api, contextHolder] = message.useMessage();

  return (
    <Card>
      {contextHolder}
      <Typography.Title level={3}>业务仪表盘</Typography.Title>
      <Typography.Paragraph>可在此扩展图表、统计卡片、表格等业务模块。</Typography.Paragraph>
      <Typography.Paragraph>
        示例 API 实例 baseURL：<code>{http.defaults.baseURL}</code>
      </Typography.Paragraph>
      <Space>
        <Permission permission="dashboard:export">
          <Button onClick={() => api.success('已触发导出任务（示例）')} type="primary">
            导出报表
          </Button>
        </Permission>
      </Space>
    </Card>
  );
}
