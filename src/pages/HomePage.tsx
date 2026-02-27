export function HomePage() {
  return (
    <section className="card">
      <h1>React 基础框架</h1>
      <p>已内置：TypeScript、路由、路由鉴权、请求封装、ESLint、Prettier、路径别名。</p>
      <ul>
        <li>登录页：支持模拟登录并持久化登录态。</li>
        <li>路由守卫：未登录跳转登录页；支持角色鉴权。</li>
        <li>目录分层：app/router/layouts/pages/services/utils。</li>
      </ul>
    </section>
  );
}
