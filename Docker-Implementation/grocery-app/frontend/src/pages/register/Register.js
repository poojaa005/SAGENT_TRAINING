import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', contactNumber: '', deliveryAddress: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        ...form,
        phoneNo: form.contactNumber,
        phone_no: form.contactNumber,
        address: form.deliveryAddress,
      });
      navigate('/');
    } catch {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">FreshMart</div>
          <h2>Join thousands of happy shoppers</h2>
          <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80" alt="Fresh" className="auth-bg-img" />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Sign up and start shopping fresh today</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Contact</label>
                <div className="input-wrap">
                  <input type="tel" name="contactNumber" placeholder="9876543210" value={form.contactNumber} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Email address</label>
              <div className="input-wrap">
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <input type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <div className="input-wrap">
                <input
                  type="text"
                  name="deliveryAddress"
                  placeholder="Your delivery address"
                  value={form.deliveryAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className={`auth-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
