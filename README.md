# React 基础前端框架

一个可直接作为业务项目起点的 React + TypeScript 模板，包含以下能力：

- ✅ React 18 + Vite 6 + TypeScript 5
- ✅ React Router 6 路由体系（含 404）
- ✅ 路由鉴权（登录态校验 + 角色权限校验）
- ✅ Axios 请求封装（Token 注入 + 错误统一处理）
- ✅ ESLint 9 + TypeScript ESLint + Prettier
- ✅ 路径别名 `@/` 与目录分层

## 目录结构

```text
src/
├── app/            # 应用入口组装
├── components/     # 通用组件（如路由守卫）
├── constants/      # 常量
├── contexts/       # 全局状态（Auth）
├── layouts/        # 布局组件
├── pages/          # 页面组件
├── router/         # 路由配置
├── services/       # 服务层（模拟登录等）
├── styles/         # 全局样式
├── types/          # 类型声明
└── utils/          # 工具（http/storage）
```

## 快速开始

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`。

## 账号示例

- admin / 123456（可访问 `/admin`）
- user / 123456（访问 `/admin` 会跳转 403）

## 可扩展建议

1. 接入真实后端登录与刷新 token。
2. 增加状态管理（Redux Toolkit / Zustand）。
3. 增加单元测试与端到端测试。
4. 引入 UI 组件库（Ant Design / MUI）与主题方案。
