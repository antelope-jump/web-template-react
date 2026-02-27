# React 基础前端框架

一个可直接作为业务项目起点的 React + TypeScript 模板，包含以下能力：

- ✅ React 18 + Vite 6 + TypeScript 5
- ✅ React Router 6 路由体系（含 404）
- ✅ 支持后端返回鉴权路由并动态渲染菜单/页面
- ✅ 页面级懒加载（`React.lazy` + `Suspense`）
- ✅ Zustand 统一状态管理（登录态、用户信息）
- ✅ 真实后端认证流程（登录 + 刷新 token + 登出）
- ✅ Axios 请求封装（Token 注入 + 401 自动刷新 + 错误统一处理）
- ✅ Ant Design 组件库 + 主题方案
- ✅ ESLint + Prettier 代码规范约束
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

默认请求地址为 `/api`，并支持本地开发代理（Vite `server.proxy`），可通过 `.env` 覆盖：

```bash
# 浏览器请求前缀
VITE_API_BASE_URL=https://your-api.example.com

# 本地开发代理目标（dev 时把 /api 转发到后端）
VITE_PROXY_TARGET=http://127.0.0.1:8080
```

建议复制一份模板再按环境修改：

```bash
cp .env.example .env
```

## 开发与质量检查

```bash
npm run dev       # 启动前端开发环境（含 /api 本地代理）
npm run lint      # ESLint 检查
npm run typecheck # TypeScript 类型检查
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
- `GET /auth/routes`
  - response: `[{ path, name, component, roles? }]`

## 测试

```bash
npm run test
npm run test:e2e
```
