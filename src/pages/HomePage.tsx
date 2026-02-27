import { Card, Typography } from 'antd';

export function HomePage() {
  return (
    <Card>
      <Typography.Title level={3}>React 基础框架</Typography.Title>
      <Typography.Paragraph>
        已内置：TypeScript、路由、路由鉴权、请求封装、Zustand、Ant Design 主题、单元测试、E2E。
      </Typography.Paragraph>
      <ul>
        <li>登录页：接入真实后端登录并持久化 accessToken / refreshToken。</li>
        <li>请求拦截器：401 自动刷新 token 并重放原请求。</li>
        <li>目录分层：app/router/layouts/pages/services/store/utils。</li>
      </ul>
    </Card>
  );
}
