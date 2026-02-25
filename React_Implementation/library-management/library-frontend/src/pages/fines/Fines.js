import React, { useEffect, useState } from 'react';
import { fineService } from '../../services/fineService';
import { borrowService } from '../../services/borrowService';
import Modal from '../../components/Modal/Modal';
import './Fines.css';

function Fines() {
  const [fines, setFines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ requestId: '', returnDate: '' });
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const [f, r] = await Promise.all([fineService.getAll(), borrowService.getAll()]);
      setFines(f);
      setRequests(r.filter(req => req.status === 'APPROVED'));
    } catch (err) {
      setFines([]);
      setRequests([]);
      const status = err?.response?.status;
      setError(status === 403 ? 'You are not allowed to view fines.' : 'Failed to load fines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await fineService.calculateFine(form.requestId, form.returnDate);
      setModal({ open: false });
      load();
    } catch {
      setError('Failed to calculate fine. Check the request ID and date.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fine record?')) return;
    setError('');
    try {
      await fineService.deleteFine(id);
      load();
    } catch {
      setError('Failed to delete fine.');
    }
  };

  const totalAmount = fines.reduce((sum, f) => sum + (f.amount || 0), 0);

  return (
    <div className="fines-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Fines</h1>
        <p className="page-subtitle">Overdue book fines and payment records</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red">💰</div>
          <div>
            <div className="stat-card__value">{fines.length}</div>
            <div className="stat-card__label">Total Fines</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--amber">₹</div>
          <div>
            <div className="stat-card__value">₹{totalAmount.toFixed(2)}</div>
            <div className="stat-card__label">Total Amount</div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="page-actions">
        <button className="btn btn--primary btn--md" onClick={() => { setForm({ requestId: '', returnDate: '' }); setModal({ open: true }); }}>
          + Calculate Fine
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fine ID</th>
                <th>Member</th>
                <th>Book</th>
                <th>Return Date</th>
                <th>Days Overdue</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fines.length === 0 ? (
                <tr><td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-state__icon">💰</div>
                    <p className="empty-state__text">No fines recorded</p>
                  </div>
                </td></tr>
              ) : fines.map(fine => (
                <tr key={fine.id || fine.fine_id}>
                  <td>#{fine.id || fine.fine_id}</td>
                  <td>{fine.borrowRequest?.member?.name || fine.member?.name || '—'}</td>
                  <td>{fine.borrowRequest?.book?.book_title || fine.book?.book_title || '—'}</td>
                  <td>{fine.returnDate || fine.return_date || '—'}</td>
                  <td>
                    <span className="fine-days">{fine.daysOverdue || fine.days_overdue || 0} days</span>
                  </td>
                  <td>
                    <span className="fine-amount">₹{(fine.amount || 0).toFixed(2)}</span>
                  </td>
                  <td>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(fine.id || fine.fine_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title="Calculate Fine" size="sm">
        <form onSubmit={handleCalculate}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Borrow Request</label>
            <select className="form-select" value={form.requestId} onChange={e => setForm({ ...form, requestId: e.target.value })} required>
              <option value="">Select approved request...</option>
              {requests.map(r => (
                <option key={r.request_id} value={r.request_id}>
                  #{r.request_id} — {r.member?.name} / {r.book?.book_title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Actual Return Date</label>
            <input className="form-input" type="date" value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary btn--md" onClick={() => setModal({ open: false })}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md">Calculate</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Fines;
