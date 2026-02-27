import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { student, officer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🎓</div>
          <span className="logo-text">EduAdmit</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/courses" className={`nav-link ${isActive('/courses') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Courses</Link>

          {student ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/apply" className={`nav-link ${isActive('/apply') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Apply</Link>
              <Link to="/status" className={`nav-link ${isActive('/status') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Status</Link>
              <Link to="/ai-assistant" className={`nav-link ai-link ${isActive('/ai-assistant') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>✨ AI Assistant</Link>
              <div className="nav-user">
                <span className="user-avatar">{student.name?.[0]?.toUpperCase()}</span>
                <span className="user-name">{student.name?.split(' ')[0]}</span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : officer ? (
            <>
              <Link to="/officer/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Officer Dashboard</Link>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/ai-assistant" className={`nav-link ai-link ${isActive('/ai-assistant') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>✨ AI Assistant</Link>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-nav-cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
              <Link to="/officer/login" className="nav-link officer-link" onClick={() => setMenuOpen(false)}>Officer Portal</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
