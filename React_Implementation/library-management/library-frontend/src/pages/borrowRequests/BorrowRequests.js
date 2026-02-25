import React, { useEffect, useState } from 'react';
import { borrowService } from '../../services/borrowService';
import { bookService } from '../../services/bookService';
import { memberService } from '../../services/memberService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Modal/Modal';
import './BorrowRequests.css';

function BorrowRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false });
  const [newReq, setNewReq] = useState({ memberId: '', bookId: '' });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const load = async () => {
    setError('');
    try {
      const [reqs, bks, mems] = await Promise.all([
        borrowService.getAll(),
        bookService.getAll(),
        memberService.getAll(),
      ]);
      setRequests(reqs);
      setBooks(bks);
      setMembers(mems);
    } catch (err) {
      setRequests([]);
      setBooks([]);
      setMembers([]);
      const status = err?.response?.status;
      setError(status === 403 ? 'You are not allowed to view borrow requests.' : 'Failed to load borrow requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = requests.filter(r => filter === 'ALL' || r.status === filter);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await borrowService.createRequest(newReq.memberId, newReq.bookId);
      setModal({ open: false });
      load();
    } catch {
      setError('Failed to create request.');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setError('');
    try {
      await borrowService.updateStatus(id, status);
      load();
    } catch {
      setError('Failed to update request status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    setError('');
    try {
      await borrowService.deleteRequest(id);
      load();
    } catch {
      setError('Failed to cancel request.');
    }
  };

  const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RETURNED'];

  return (
    <div className="borrow-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Borrow Requests</h1>
        <p className="page-subtitle">Manage book borrowing and return operations</p>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="page-actions">
        <div className="borrow-filters">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              className={`category-btn ${filter === s ? 'category-btn--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="btn btn--primary btn--md" onClick={() => { setNewReq({ memberId: user?.memberId || '', bookId: '' }); setModal({ open: true }); }}>
          + New Request
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Member</th>
                <th>Book</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <p className="empty-state__text">No requests found</p>
                  </div>
                </td></tr>
              ) : filtered.map(req => (
                <tr key={req.request_id}>
                  <td>#{req.request_id}</td>
                  <td>{req.member?.name}</td>
                  <td className="borrow-book-title">{req.book?.book_title}</td>
                  <td>{req.request_date}</td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>
                    <div className="data-table__actions">
                      {req.status === 'PENDING' && (
                        <>
                          <button className="btn btn--teal btn--sm" onClick={() => handleStatusUpdate(req.request_id, 'APPROVED')}>Approve</button>
                          <button className="btn btn--danger btn--sm" onClick={() => handleStatusUpdate(req.request_id, 'REJECTED')}>Reject</button>
                        </>
                      )}
                      {req.status === 'APPROVED' && (
                        <button className="btn btn--ghost btn--sm" onClick={() => handleStatusUpdate(req.request_id, 'RETURNED')}>Mark Returned</button>
                      )}
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(req.request_id)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title="New Borrow Request" size="sm">
        <form onSubmit={handleCreate}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Member</label>
            <select className="form-select" value={newReq.memberId} onChange={e => setNewReq({ ...newReq, memberId: e.target.value })} required>
              <option value="">Select member...</option>
              {members.map(m => <option key={m.memberId} value={m.memberId}>{m.name} (#{m.memberId})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Book</label>
            <select className="form-select" value={newReq.bookId} onChange={e => setNewReq({ ...newReq, bookId: e.target.value })} required>
              <option value="">Select book...</option>
              {books.filter(b => b.book_quantity > 0).map(b => <option key={b.book_id} value={b.book_id}>{b.book_title}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary btn--md" onClick={() => setModal({ open: false })}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md">Submit Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default BorrowRequests;
