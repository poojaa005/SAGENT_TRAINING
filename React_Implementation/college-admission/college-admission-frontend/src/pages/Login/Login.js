import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../Register/Register.css';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await getAllStudents();
      const found = res.data.find(s => s.email === form.email && s.password === form.password);
      if (!found) { setError('Invalid email or password.'); setLoading(false); return; }
      loginStudent(found);
      navigate('/dashboard');
    } catch {
      setError('Failed to connect to server. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="al-logo">🎓 EduAdmit</div>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your admission journey and track your application status.</p>
          <div className="al-features">
            <div className="al-feature"><span>📊</span> Track your application</div>
            <div className="al-feature"><span>📁</span> Manage documents</div>
            <div className="al-feature"><span>💳</span> Complete payments</div>
            <div className="al-feature"><span>✨</span> Get AI assistance</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Sign In</h1>
            <p>New to EduAdmit? <Link to="/register">Create an account</Link></p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : '🔓 Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <p className="auth-officer-link">
            Are you an officer? <Link to="/officer/login">Officer Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
