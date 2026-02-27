import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="card">
      <h2>404 页面不存在</h2>
      <p>请检查访问路径是否正确。</p>
      <Link to="/">返回首页</Link>
    </section>
  );
}
