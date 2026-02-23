import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard', icon: 'fa-home', path: '/', section: 'Main' },
  { label: 'Income', icon: 'fa-arrow-trend-up', path: '/income', section: 'Finance' },
  { label: 'Expenses', icon: 'fa-arrow-trend-down', path: '/expenses', section: 'Finance' },
  { label: 'Budget', icon: 'fa-wallet', path: '/budget', section: 'Finance' },
  { label: 'Goals', icon: 'fa-bullseye', path: '/goals', section: 'Planning' },
];

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [...new Set(navItems.map((i) => i.section))];

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>
            <span>Budget</span>Tracker
          </h2>
          <p>Personal Finance Manager</p>
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <h4>{user.name}</h4>
              <p>ID: #{user.userId}</p>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section}>
              <div className="nav-section-title">{section}</div>
              {navItems
                .filter((i) => i.section === section)
                .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
