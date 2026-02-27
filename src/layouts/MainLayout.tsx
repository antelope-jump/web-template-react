import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

const menus = [
  { to: '/', label: '首页' },
  { to: '/dashboard', label: '仪表盘' },
  { to: '/admin', label: '管理页（需 admin）' },
];

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="logo" to="/">
          React Starter
        </Link>
        <nav className="main-nav">
          {menus.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="user-box">
          <span>
            当前用户：<b>{user?.name}</b>（{user?.role}）
          </span>
          <button onClick={handleLogout} type="button">
            退出登录
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
