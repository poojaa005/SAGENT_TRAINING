import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: 'DB', label: 'Dashboard', roles: ['member', 'librarian'] },
  { path: '/books', icon: 'BK', label: 'Books', roles: ['member', 'librarian'] },
  { path: '/inventory', icon: 'IN', label: 'Inventory', roles: ['librarian'] },
  { path: '/borrow-requests', icon: 'BR', label: 'Borrow Requests', roles: ['librarian'] },
  { path: '/members', icon: 'MB', label: 'Members', roles: ['librarian'] },
  { path: '/fines', icon: 'FN', label: 'Fines', roles: ['member', 'librarian'] },
  { path: '/notifications', icon: 'NT', label: 'Notifications', roles: ['member', 'librarian'] },
  { path: '/ai', icon: 'AI', label: 'AI Assistant', roles: ['member', 'librarian'] },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const role = user?.role || 'member';
  const visibleItems = navItems.filter(item => !item.roles || item.roles.includes(role));
  const userId = role === 'librarian'
    ? (user?.librarianId || user?.id || '-')
    : (user?.memberId || user?.id || '-');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">[]</span>
          {!collapsed && <span className="sidebar__logo-text">LibraryMS</span>}
        </div>
        <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '>' : '<'}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{user?.name || 'User'}</span>
            <span className="sidebar__user-id">{role.toUpperCase()} | ID: {userId}</span>
          </div>
        </div>
      )}

      <nav className="sidebar__nav">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <span className="sidebar__link-icon">LO</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;
