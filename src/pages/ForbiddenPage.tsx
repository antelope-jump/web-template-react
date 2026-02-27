import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <section className="card">
      <h2>403 无权限访问</h2>
      <p>你当前角色无权访问该页面，请联系管理员。</p>
      <Link to="/">返回首页</Link>
    </section>
  );
}
