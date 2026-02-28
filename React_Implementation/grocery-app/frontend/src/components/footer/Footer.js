import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <div className="footer-logo">🌿 FreshMart</div>
        <p>Fresh groceries delivered to your doorstep. Quality you can taste, service you can trust.</p>
        <div className="social-links">
          <a href="#!" aria-label="Facebook">📘</a>
          <a href="#!" aria-label="Instagram">📸</a>
          <a href="#!" aria-label="Twitter">🐦</a>
        </div>
      </div>
      <div className="footer-links-group">
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/products">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My Orders</Link>
      </div>
      <div className="footer-links-group">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/ai-assistant">AI Assistant</Link>
      </div>
      <div className="footer-links-group">
        <h4>Contact</h4>
        <p>📍 T Nagar, Chennai</p>
        <p>📞 +91 9876543210</p>
        <p>📧 hello@freshmart.com</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2024 FreshMart. All rights reserved. Made with 💚</p>
    </div>
  </footer>
);

export default Footer;
