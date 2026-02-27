import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { makePayment } from '../../services/api';
import './Payment.css';

const methods = [
  { id: 'UPI', icon: '📱', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'Card', icon: '💳', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, Rupay' },
  { id: 'Net Banking', icon: '🏦', label: 'Net Banking', desc: 'All major banks supported' },
];

function Payment() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    const parsedAppId = parseInt(appId, 10);
    if (!Number.isFinite(parsedAppId)) {
      alert('Invalid application ID. Please submit an application first.');
      return;
    }

    setLoading(true);
    try {
      await makePayment({
        appId: parsedAppId,
        amount: 500.00,
        paymentMethod: method,
        paymentStatus: 'Completed',
        paymentDate: new Date().toISOString().slice(0, 19)
      });
      setPaid(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (paid) {
    return (
      <div className="payment-page page-wrapper">
        <div className="payment-success">
          <div className="ps-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your application fee of <strong>₹500</strong> has been received.</p>
          <div className="ps-details">
            <div className="ps-row"><span>Application ID</span><strong>#{appId}</strong></div>
            <div className="ps-row"><span>Amount</span><strong>₹500.00</strong></div>
            <div className="ps-row"><span>Method</span><strong>{method}</strong></div>
            <div className="ps-row"><span>Status</span><strong style={{ color: '#10b981' }}>Completed ✅</strong></div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page page-wrapper">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="payment-header">
          <h1>Application Fee Payment</h1>
          <p>Complete your payment to finalize your application submission.</p>
        </div>

        <div className="payment-card card">
          <div className="payment-amount-box">
            <div className="pab-label">Amount to Pay</div>
            <div className="pab-amount">₹500.00</div>
            <div className="pab-app">Application #{appId}</div>
          </div>

          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            {methods.map(m => (
              <div
                key={m.id}
                className={`payment-method ${method === m.id ? 'selected' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <div className="pm-radio">{method === m.id ? '●' : '○'}</div>
                <div className="pm-icon">{m.icon}</div>
                <div>
                  <div className="pm-label">{m.label}</div>
                  <div className="pm-desc">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {method === 'UPI' && (
            <div className="payment-input-section">
              <div className="form-group">
                <label>UPI ID</label>
                <input className="form-control" placeholder="yourname@upi" />
              </div>
            </div>
          )}
          {method === 'Card' && (
            <div className="payment-input-section">
              <div className="form-group">
                <label>Card Number</label>
                <input className="form-control" placeholder="1234 5678 9012 3456" maxLength={19} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Expiry</label>
                  <input className="form-control" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input className="form-control" placeholder="***" type="password" />
                </div>
              </div>
            </div>
          )}
          {method === 'Net Banking' && (
            <div className="payment-input-section">
              <div className="form-group">
                <label>Select Bank</label>
                <select className="form-control">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            </div>
          )}

          <div className="payment-secure">
            🔒 Your payment is 100% secure and encrypted. We do not store card details.
          </div>

          <button className="btn-pay" onClick={handlePayment} disabled={loading}>
            {loading ? '⏳ Processing...' : `Pay ₹500 via ${method}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
