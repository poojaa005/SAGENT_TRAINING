import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/memberService';
import Modal from '../../components/Modal/Modal';
import './Members.css';

const emptyForm = { name: '', email: '', password: '' };

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return !q || m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setForm(emptyForm);
    setError('');
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (member) => {
    setForm({ name: member.name, email: member.email, password: member.password || '' });
    setError('');
    setModal({ open: true, mode: 'edit', data: member });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (modal.mode === 'create') {
        await memberService.create(form);
      } else {
        await memberService.update(modal.data.memberId, form);
      }
      setModal({ open: false, mode: 'create', data: null });
      load();
    } catch {
      setError('Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    await memberService.delete(id);
    load();
  };

  return (
    <div className="members-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Members</h1>
        <p className="page-subtitle">Manage library members and registrations</p>
      </div>

      <div className="page-actions">
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input
            className="search-bar__input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn--primary btn--md" onClick={openCreate}>+ Add Member</button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Library ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="4">
                  <div className="empty-state">
                    <div className="empty-state__icon">👥</div>
                    <p className="empty-state__text">No members found</p>
                  </div>
                </td></tr>
              ) : filtered.map(m => (
                <tr key={m.memberId}>
                  <td><span className="member-id">#{m.memberId}</span></td>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.email}</td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(m)}>Edit</button>
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(m.memberId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', data: null })}
        title={modal.mode === 'create' ? 'Add Member' : 'Edit Member'}
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={modal.mode === 'create'} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary btn--md" onClick={() => setModal({ open: false, mode: 'create', data: null })}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md">
              {modal.mode === 'create' ? 'Add Member' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Members;
