import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { memberService } from '../../services/memberService';
import { librarianService } from '../../services/librarianService';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const normalizeEmail = (value) => (value || '').trim().toLowerCase();
  const normalizePassword = (value) => (value || '').trim();
  const getEmail = (account) =>
    normalizeEmail(
      account?.email ??
      account?.emailId ??
      account?.librarian_email ??
      account?.librarianEmail ??
      account?.mail ??
      account?.userEmail ??
      account?.username ??
      account?.userName
    );
  const getPassword = (account) =>
    account?.password ??
    account?.librarian_password ??
    account?.librarianPassword ??
    account?.pwd ??
    account?.passcode ??
    account?.userPassword;

  const findMatchingLibrarian = (list) => {
    if (!Array.isArray(list)) return null;
    return list.find((l) => {
      const emailMatches = getEmail(l) === normalizeEmail(form.email);
      const password = getPassword(l);
      if (password === undefined || password === null) return emailMatches;
      return emailMatches && String(password) === normalizePassword(form.password);
    });
  };

  const authenticateMember = async () => {
    const members = await memberService.searchByEmail(form.email);
    return members.find(
      m =>
        normalizeEmail(m.email) === normalizeEmail(form.email) &&
        normalizePassword(m.password) === normalizePassword(form.password)
    );
  };

  const authenticateLibrarian = async () => {
    const librarians = await librarianService.getAll();
    return findMatchingLibrarian(librarians);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const account = form.role === 'librarian'
        ? await authenticateLibrarian()
        : await authenticateMember();

      if (account) {
        login(account, form.role);
        navigate('/');
      } else {
        setError(`Invalid ${form.role} email or password.`);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Invalid credentials for selected role.');
      } else if (status === 500 && form.role === 'librarian') {
        setError('Backend error in /librarians API. Check librarian entity data or null values in server.');
      } else if (status === 404) {
        setError('Librarian endpoint /librarians not found. Check backend route mapping.');
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
