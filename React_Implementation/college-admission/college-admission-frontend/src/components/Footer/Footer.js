import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">🎓 EduAdmit</div>
          <p>Simplifying college admissions for thousands of students. Apply smarter, not harder.</p>
          <div className="footer-social">
            <span>📘</span><span>🐦</span><span>📷</span><span>💼</span>
          </div>
        </div>
        <div className="footer-links">
          <h4>Students</h4>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/apply">Apply Now</Link>
          <Link to="/status">Check Status</Link>
        </div>
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/courses">Courses</Link>
          <Link to="/ai-assistant">AI Assistant</Link>
          <Link to="/officer/login">Officer Portal</Link>
        </div>
        <div className="footer-links">
          <h4>Contact</h4>
          <span>📧 admissions@eduadmit.edu</span>
          <span>📞 +91 9876543210</span>
          <span>📍 Chennai, Tamil Nadu</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 EduAdmit. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
