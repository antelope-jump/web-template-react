# React 基础前端框架

一个可直接作为业务项目起点的 React + TypeScript 模板，包含以下能力：

- ✅ React 18 + Vite 6 + TypeScript 5
- ✅ React Router 6 路由体系（含 404）
- ✅ 支持后端返回鉴权路由并动态渲染菜单/页面
- ✅ 支持角色 + 权限点（Permission Code）+ 数据范围（Data Scope）
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

默认请求地址为 `/api`，并支持本地开发代理（Vite `server.proxy`）。

本项目已提供：

- `.env.example`：环境变量模板
- `.env.development`：开发环境默认值（`npm run dev` 会自动加载）

如需自定义，建议创建 `.env.development.local`（不提交到仓库）覆盖本地配置：

```bash
cp .env.example .env.development.local
```

可用变量：

```bash
# 浏览器请求前缀
VITE_API_BASE_URL=https://your-api.example.com

# 本地开发代理目标（dev 时把 /api 转发到后端）
VITE_PROXY_TARGET=http://127.0.0.1:8080

# 是否启用内置 Mock API（true 时关闭代理）
VITE_ENABLE_MOCK=false
```

> 说明：`vite.config.ts` 使用 `loadEnv(mode, process.cwd(), 'VITE_')`，仅加载 `VITE_` 前缀变量，符合 Vite 推荐方式。

## 开发与质量检查

```bash
npm run dev       # 启动前端开发环境（含 /api 本地代理）
npm run dev:mock  # 启动前端开发环境（使用内置 Mock API）
npm run lint      # ESLint 检查
npm run typecheck # TypeScript 类型检查
```

## 本地 Mock 服务

项目内置了开发期 Mock API（Vite middleware），可用于前后端未联调时的本地自测：

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/routes`

可用测试账号：

- `admin / 123456`
- `user / 123456`

Mock 用户能力差异：

- `admin`：`dataScope=ALL`，包含 `dashboard:export`、`admin:user:create`、`admin:user:delete` 等权限
- `user`：`dataScope=SELF`，仅包含首页和仪表盘查看权限

Admin 账号可见完整权限后台菜单：

- `/admin` 管理主页
- `/admin/users` 用户管理
- `/admin/permissions` 权限管理
- `/admin/roles` 角色管理
- `/admin/menus` 菜单管理

## 权限能力清单（当前实现）

- 路由权限：支持 `roles` + `permissionCode` 双重校验
- 菜单权限：按 `hidden`、`permissionCode`、`order` 动态过滤与排序
- 菜单结构：支持 `parentPath / parentId` 树形菜单（导航、菜单管理、角色分配均为树形）
- 按钮权限：提供 `Permission` 组件与 `usePermission` Hook
- 数据权限：用户信息包含 `dataScope` 字段（`SELF` / `DEPT` / `ALL`）

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
- `GET /admin/roles`
  - response: `[{ id, name, code, userCount, status }]`
- `GET /admin/role-menus`
  - response: `[{ roleCode, menuIds[] }]`
- `POST /admin/roles/assign-menus`
  - request: `{ roleCode, menuIds[] }`
- `GET /admin/users`
  - response: `[{ id, username, nickname, status, roles[] }]`
- `POST /admin/users/assign-roles`
  - request: `{ userId, roles[] }`
- `GET /admin/menus`
  - response: `[{ id, name, path, type, permissionCode, status, parentId? }]`
- `GET /admin/permissions`
  - response: `[{ id, module, name, code, status }]`
- `GET /admin/role-permissions`
  - response: `[{ id, roleName, roleCode, permissions[] }]`

## 测试

```bash
npm run test
npm run test:e2e
```
