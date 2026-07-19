import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AppLayout.css';

const NAV_BY_ROLE = {
  SUPER_ADMIN: [
    { to: '/', label: 'Dashboard' },
    { to: '/admin/approvals', label: 'Approvals' },
    { to: '/admin/reports', label: 'Audit Log' },
    { to: '/profile', label: 'Profile' },
  ],
  CLIENT: [
    { to: '/', label: 'Dashboard' },
    { to: '/my-products', label: 'My Listings' },
    { to: '/incoming-orders', label: 'Rental Requests' },
    { to: '/profile', label: 'Profile' },
  ],
  USER: [
    { to: '/', label: 'Dashboard' },
    { to: '/products', label: 'Browse' },
    { to: '/orders', label: 'My Orders' },
    { to: '/profile', label: 'Profile' },
  ],
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_BY_ROLE[user?.role] || [];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          RENT<span className="dot">·</span>EASE
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="sidebar-role">{user?.role?.replace('_', ' ')}</p>
          <p className="sidebar-name">{user?.name}</p>
          <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
