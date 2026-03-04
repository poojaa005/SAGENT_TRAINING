import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { incomeService } from '../../services/incomeService';
import { categoryService } from '../../services/categoryService';
import Card from '../../components/card/Card';
import Modal from '../../components/modal/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../income/Income.css';
import '../../components/modal/Modal.css';

const defaultForm = { source: '', amount: '', date: '', description: '', categoryId: '' };

const Income = () => {
  const { user } = useUser();
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchIncomes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await incomeService.getIncomeByUser(user.userId);
      setIncomes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getAllCategories();
      const incomeCategories = (res.data || []).filter((c) => c.type === 'INCOME');
      setCategories(incomeCategories);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchIncomes(); }, [fetchIncomes]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (inc) => {
    setForm({
      source: inc.source,
      amount: inc.amount,
      date: inc.date,
      description: inc.description || '',
      categoryId: inc.category?.categoryId || '',
    });
    setEditId(inc.incomeId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.source || !form.amount || !form.date || !form.categoryId) return;
    setSaving(true);
    try {
      const payload = {
        source: form.source,
        amount: parseFloat(form.amount),
        date: form.date,
        description: form.description,
        category: { categoryId: parseInt(form.categoryId, 10) },
      };
      if (editId) {
        await incomeService.updateIncome(editId, payload);
      } else {
        await incomeService.createIncome(user.userId, payload);
      }
      setShowModal(false);
      fetchIncomes();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income entry?')) return;
    try {
      await incomeService.deleteIncome(id);
      fetchIncomes();
    } catch (err) {
      console.error(err);
    }
  };

  const total = incomes.reduce((s, i) => s + (i.amount || 0), 0);
  const thisMonth = incomes.filter((i) => {
    const d = new Date(i.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <h1>Income</h1>
          <p>Track all your income sources</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Income
        </button>
      </div>

      <div className="summary-cards">
        <Card label="Total Income" value={formatCurrency(total)} icon="fa-arrow-trend-up" color="green" sub={`${incomes.length} entries`} />
        <Card label="This Month" value={formatCurrency(thisMonth)} icon="fa-calendar" color="blue" />
        <Card label="Avg per Entry" value={formatCurrency(incomes.length ? total / incomes.length : 0)} icon="fa-chart-bar" color="purple" />
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>Income Records</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{incomes.length} entries</span>
        </div>
        {loading ? (
          <div className="table-empty"><i className="fas fa-spinner fa-spin"></i></div>
        ) : incomes.length === 0 ? (
          <div className="table-empty">
            <i className="fas fa-coins"></i>
            <p>No income recorded yet</p>
            <small>Click "Add Income" to get started</small>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Source</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc, idx) => (
                <tr key={inc.incomeId}>
                  <td>{idx + 1}</td>
                  <td><strong>{inc.source}</strong></td>
                  <td>{inc.category?.categoryName || inc.category?.name || '-'}</td>
                  <td><span className="amount-cell positive">+{formatCurrency(inc.amount)}</span></td>
                  <td>{formatDate(inc.date)}</td>
                  <td>{inc.description || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon edit" onClick={() => openEdit(inc)} title="Edit">
                        <i className="fas fa-pen"></i>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(inc.incomeId)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal
          title={editId ? 'Edit Income' : 'Add Income'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                {editId ? 'Update' : 'Add Income'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Source *</label>
            <input type="text" placeholder="e.g. Salary, Freelance" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (Rs) *</label>
              <input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.categoryName || c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Optional notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Income;
