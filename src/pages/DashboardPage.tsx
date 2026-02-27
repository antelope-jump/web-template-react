import { http } from '@/utils/http';

export function DashboardPage() {
  return (
    <section className="card">
      <h2>业务仪表盘</h2>
      <p>可在此扩展图表、统计卡片、表格等业务模块。</p>
      <p>
        示例 API 实例 baseURL：<code>{http.defaults.baseURL}</code>
      </p>
    </section>
  );
}
