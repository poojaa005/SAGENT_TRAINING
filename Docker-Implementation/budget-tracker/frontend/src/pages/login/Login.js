import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useUser } from '../../context/UserContext';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await userService.getAllUsers();
      const users = res.data;
      const inputEmail = form.email.trim().toLowerCase();
      const inputPassword = form.password.trim();
      const found = users.find(
        (u) => u.email?.toLowerCase() === inputEmail && u.password === inputPassword
      );

      if (found) {
        login(found);
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="fas fa-wallet"></i>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your finances</p>
        </div>

        {error && (
          <div className="auth-error">
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
