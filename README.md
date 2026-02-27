# React 基础前端框架

一个可直接作为业务项目起点的 React + TypeScript 模板，包含以下能力：

- ✅ React 18 + Vite 6 + TypeScript 5
- ✅ React Router 6 路由体系（含 404）
- ✅ Zustand 统一状态管理（登录态、用户信息）
- ✅ 真实后端认证流程（登录 + 刷新 token + 登出）
- ✅ Axios 请求封装（Token 注入 + 401 自动刷新 + 错误统一处理）
- ✅ Ant Design 组件库 + 主题方案
- ✅ Vitest 单元测试 + E2E 风格流程测试

## 目录结构

```text
src/
├── app/            # 应用入口组装（包含 Antd Theme）
├── components/     # 通用组件（如路由守卫）
├── constants/      # 常量
├── layouts/        # 布局组件
├── pages/          # 页面组件
├── router/         # 路由配置
├── services/       # 服务层（真实 auth API）
├── store/          # Zustand store
├── styles/         # 全局样式
├── test/           # 测试初始化
├── types/          # 类型声明
└── utils/          # 工具（http/storage）
```

## 环境变量

默认请求地址为 `/api`，可通过 `.env` 覆盖：

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

## 后端接口约定

- `POST /auth/login`
  - request: `{ username, password }`
  - response: `{ accessToken, refreshToken, profile }`
- `POST /auth/refresh`
  - request: `{ refreshToken }`
  - response: `{ accessToken }`
- `POST /auth/logout`
  - request: `{ refreshToken }`

## 测试

```bash
npm run test
npm run test:e2e
```
