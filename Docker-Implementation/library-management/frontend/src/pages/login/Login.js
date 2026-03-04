import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = await authService.login(form.email, form.password);
      const backendRole = (auth?.role || '').toLowerCase();

      if (backendRole && backendRole !== form.role) {
        setError(`This account is a ${backendRole}. Please choose ${backendRole} role.`);
        return;
      }

      login(auth, backendRole || form.role, auth?.token);
      navigate('/');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Invalid credentials for selected role.');
      } else if (status === 404) {
        setError('Auth endpoint not found. Check backend /api/auth/login mapping.');
      } else {
        setError('Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration" />
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand__icon">⬡</span>
          <span className="auth-brand__name">LibraryMS</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your library account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Login As</label>
            <select
              className="form-select"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="btn btn--primary btn--lg auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          {form.role === 'member' ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Register here</Link>
            </>
          ) : (
            'Librarian accounts are managed by admin.'
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
