import React, { useEffect, useState } from 'react';
import { fineService } from '../../services/fineService';
import { paymentService } from '../../services/paymentService';
import { borrowService } from '../../services/borrowService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import './Fines.css';

function Fines() {
  const { user, isLibrarian } = useAuth();
  const memberId = user?.memberId || user?.id;
  const [fines, setFines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ requestId: '', returnDate: '' });
  const [error, setError] = useState('');
  const [paidFineIds, setPaidFineIds] = useState(new Set());

  const getFineId = (fine) =>
    fine?.id ??
    fine?.fine_id ??
    fine?.fineId ??
    fine?.borrowRequest?.fineId ??
    fine?.borrowRequest?.fine_id;

  const getFineRowKey = (fine, index) => {
    const fineId = getFineId(fine);
    if (fineId !== undefined && fineId !== null && fineId !== '') {
      return `fine-${fineId}`;
    }
    const requestId = fine?.borrowRequest?.request_id ?? fine?.borrowRequestId ?? 'na';
    const returnDate = fine?.returnDate ?? fine?.return_date ?? 'na';
    return `fine-fallback-${requestId}-${returnDate}-${index}`;
  };

  const getPaymentFineId = (payment) =>
    payment?.fineId ??
    payment?.fine_id ??
    payment?.fine?.id ??
    payment?.fine?.fine_id;

  const isFinePaid = (fine) => {
    const status = (fine.status || fine.paymentStatus || '').toString().toUpperCase();
    const fineId = getFineId(fine);
    const amount = Number(fine?.amount);
    const amountCleared = Number.isFinite(amount) && amount <= 0;
    return Boolean(
      fine.paid ||
      fine.isPaid ||
      status === 'PAID' ||
      paidFineIds.has(String(fineId)) ||
      amountCleared
    );
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLibrarian) {
        const [f, r, p] = await Promise.all([
          fineService.getAll(),
          borrowService.getAll(),
          paymentService.getAll().catch(() => []),
        ]);
        setFines(f);
        setRequests(r.filter(req => req.status === 'APPROVED'));
        const paidIds = new Set((Array.isArray(p) ? p : []).map(getPaymentFineId).filter(Boolean).map(String));
        setPaidFineIds(paidIds);
      } else {
        if (!memberId) {
          setFines([]);
          setRequests([]);
          setPaidFineIds(new Set());
          return;
        }
        const [allFines, payments] = await Promise.all([
          fineService.getAll(),
          paymentService.getAll().catch(() => []),
        ]);
        const memberFines = (Array.isArray(allFines) ? allFines : []).filter(fine => {
          const fineMemberId =
            fine.member?.memberId ??
            fine.borrowRequest?.member?.memberId ??
            fine.memberId;
          return String(fineMemberId) === String(memberId);
        });
        setFines(Array.isArray(memberFines) ? memberFines : []);
        setRequests([]);
        const paidIds = new Set((Array.isArray(payments) ? payments : []).map(getPaymentFineId).filter(Boolean).map(String));
        setPaidFineIds(paidIds);
      }
    } catch (err) {
      setFines([]);
      setRequests([]);
      setPaidFineIds(new Set());
      const status = err?.response?.status;
      if (status === 403 && !isLibrarian) {
        setError('Backend is currently blocking member fine access. Ask backend to allow member fines endpoint for your account.');
      } else {
        setError(status === 403 ? 'You are not allowed to view fines.' : 'Failed to load fines.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [isLibrarian, memberId]);

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
    if (id === undefined || id === null || id === '') {
      setError('Fine ID is missing for this row, so delete cannot be performed.');
      return;
    }
    if (!window.confirm('Delete this fine record?')) return;
    setError('');
    try {
      await fineService.deleteFine(id);
      load();
    } catch (err) {
      const status = err?.response?.status;
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'string' ? err.response.data : '');
      if (status === 404) {
        setError(backendMessage || 'Fine not found.');
      } else if (status === 403) {
        setError(backendMessage || 'You are not allowed to delete this fine.');
      } else if (status === 409) {
        setError(backendMessage || 'Fine cannot be deleted in its current state.');
      } else if (status === 500) {
        setError(backendMessage || 'Server failed to delete this fine.');
      } else {
        setError(backendMessage || 'Failed to delete fine.');
      }
    }
  };

  const handlePay = async (id) => {
    if (id === undefined || id === null || id === '') {
      setError('Fine ID is missing for this row, so payment cannot be initiated.');
      return;
    }
    setError('');
    setPayingId(id);
    try {
      await paymentService.payFine(id, 'UPI');
      setPaidFineIds((prev) => new Set([...prev, String(id)]));
      load();
    } catch (err) {
      const status = err?.response?.status;
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'string' ? err.response.data : '');
      if (backendMessage && /no pending fine/i.test(backendMessage)) {
        setError('This fine is not pending, so payment cannot be processed.');
      } else if (status === 409) {
        setError('This fine is not pending, so payment cannot be processed.');
      } else if (status === 500) {
        setError(backendMessage || 'Payment failed on server. Check backend logs for the exact exception.');
      } else if (status === 403 && backendMessage) {
        setError(backendMessage);
      } else if (status === 403) {
        setError('Request reached backend but access to error handling was denied. Check backend `/error` security and payment exception handling.');
      } else if (status === 404) {
        setError('Payment endpoint not found. Check backend payment controller mapping.');
      } else if (status === 400) {
        setError('Payment method is invalid. Check backend accepted method values.');
      } else {
        setError('Failed to pay fine.');
      }
    } finally {
      setPayingId(null);
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

      {isLibrarian && (
        <div className="page-actions">
          <button className="btn btn--primary btn--md" onClick={() => { setForm({ requestId: '', returnDate: '' }); setModal({ open: true }); }}>
            + Calculate Fine
          </button>
        </div>
      )}

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
              ) : fines.map((fine, index) => {
                const fineId = getFineId(fine);
                const isPayingThisFine = String(payingId) === String(fineId);
                return (
                <tr key={getFineRowKey(fine, index)}>
                  <td>{fineId ? `#${fineId}` : '-'}</td>
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
                    {isLibrarian ? (
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(fineId)} disabled={!fineId}>Delete</button>
                    ) : isFinePaid(fine) ? (
                      <span className="fine-paid-pill">Paid</span>
                    ) : (
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => handlePay(fineId)}
                        disabled={isPayingThisFine || !fineId}
                      >
                        {isPayingThisFine ? 'Paying...' : 'Pay Now'}
                      </button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isLibrarian && modal.open} onClose={() => setModal({ open: false })} title="Calculate Fine" size="sm">
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
