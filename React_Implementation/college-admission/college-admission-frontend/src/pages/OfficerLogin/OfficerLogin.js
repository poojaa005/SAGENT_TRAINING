import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getOfficers } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../Register/Register.css';
import './OfficerLogin.css';

function OfficerLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginOfficer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await getOfficers();
      const found = res.data.find(o => o.officerGmail === form.email && o.officerPassword === form.password);
      if (!found) { setError('Invalid officer credentials.'); setLoading(false); return; }
      loginOfficer(found);
      navigate('/officer/dashboard');
    } catch {
      setError('Server error. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left officer-left">
        <div className="auth-left-content">
          <div className="al-logo">🎓 EduAdmit</div>
          <h2>Officer Portal</h2>
          <p>Review and manage student admission applications efficiently.</p>
          <div className="al-features">
            <div className="al-feature"><span>📋</span> View all applications</div>
            <div className="al-feature"><span>✅</span> Approve/Reject applications</div>
            <div className="al-feature"><span>💬</span> Add review remarks</div>
            <div className="al-feature"><span>📊</span> Track admission statistics</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <div className="officer-badge">🏛️ Officer Login</div>
            <h1>Welcome, Officer</h1>
            <p>Student? <Link to="/login">Login here</Link></p>
          </div>
          {error && <div className="auth-error">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Officer Email</label>
              <input className="form-control" type="email" placeholder="officer@college.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" placeholder="Enter password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-auth-submit officer-submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : '🏛️ Officer Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Default: admin@college.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfficerLogin;
