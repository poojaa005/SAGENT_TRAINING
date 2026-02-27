import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match!'); return; }
    setLoading(true);
    try {
      const res = await registerStudent({ name: form.name, email: form.email, password: form.password });
      loginStudent(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already exist.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="al-logo">🎓 EduAdmit</div>
          <h2>Begin Your Academic Journey</h2>
          <p>Join thousands of students who have successfully applied through our platform.</p>
          <div className="al-features">
            <div className="al-feature"><span>✅</span> Free to register</div>
            <div className="al-feature"><span>🔒</span> Secure & encrypted</div>
            <div className="al-feature"><span>⚡</span> Instant confirmation</div>
            <div className="al-feature"><span>✨</span> AI-powered assistance</div>
          </div>
          <div className="al-testimonial">
            <p>"The registration was super easy. Within minutes I was applying for my dream course!"</p>
            <div className="al-test-author">— Priya K., B.Tech CSE Student</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirm"
                placeholder="Confirm your password"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : '🚀 Create My Account'}
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

export default Register;
