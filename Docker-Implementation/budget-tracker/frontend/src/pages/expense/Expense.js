import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import Card from '../../components/card/Card';
import Modal from '../../components/modal/Modal';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/formatters';
import '../income/Income.css';
import './Expense.css';
import '../../components/modal/Modal.css';

const defaultForm = { title: '', amount: '', date: '', description: '', categoryId: '' };
const getCategoryName = (category) => category?.categoryName || category?.name || '';

const Expense = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        expenseService.getExpensesByUser(user.userId),
        categoryService.getAllCategories(),
      ]);
      setExpenses(expRes.data);
      setCategories((catRes.data || []).filter((c) => c.type === 'EXPENSE'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (exp) => {
    setForm({ title: exp.title, amount: exp.amount, date: exp.date, description: exp.description || '', categoryId: exp.category?.categoryId || '' });
    setEditId(exp.expenseId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.date || !form.categoryId) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        amount: parseFloat(form.amount),
        date: form.date,
        description: form.description,
        user: { userId: user.userId },
        category: { categoryId: parseInt(form.categoryId, 10) },
      };
      if (editId) {
        await expenseService.updateExpense(editId, payload);
      } else {
        await expenseService.createExpense(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try { await expenseService.deleteExpense(id); fetchData(); } catch (err) { console.error(err); }
  };

  const filtered = expenses.filter((e) => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? getCategoryName(e.category) === filterCat : true;
    return matchSearch && matchCat;
  });

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date); const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).reduce((s, e) => s + (e.amount || 0), 0);
  const uniqueCats = [...new Set(expenses.map((e) => getCategoryName(e.category)).filter(Boolean))];

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <h1>Expenses</h1>
          <p>Monitor and manage your spending</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Expense
        </button>
      </div>

      <div className="summary-cards">
        <Card label="Total Expenses" value={formatCurrency(total)} icon="fa-arrow-trend-down" color="red" sub={`${expenses.length} entries`} />
        <Card label="This Month" value={formatCurrency(thisMonth)} icon="fa-calendar" color="yellow" />
        <Card label="Categories" value={uniqueCats.length} icon="fa-tags" color="purple" sub="active categories" />
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {uniqueCats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>Expense Records</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filtered.length} entries</span>
        </div>
        {loading ? (
          <div className="table-empty"><i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i></div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">
            <i className="fas fa-receipt"></i>
            <p>No expenses found</p>
            <small>{search || filterCat ? 'Try adjusting filters' : 'Click "Add Expense" to start'}</small>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp, idx) => (
                <tr key={exp.expenseId}>
                  <td>{idx + 1}</td>
                  <td><strong>{exp.title}</strong></td>
                  <td>
                    <div className="category-cell">
                      <span className="category-dot" style={{ background: getCategoryColor(getCategoryName(exp.category)) }}></span>
                      <span className="badge badge-category">{getCategoryName(exp.category) || '-'}</span>
                    </div>
                  </td>
                  <td><span className="amount-cell negative">-{formatCurrency(exp.amount)}</span></td>
                  <td>{formatDate(exp.date)}</td>
                  <td>{exp.description || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon edit" onClick={() => openEdit(exp)}><i className="fas fa-pen"></i></button>
                      <button className="btn-icon delete" onClick={() => handleDelete(exp.expenseId)}><i className="fas fa-trash"></i></button>
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
          title={editId ? 'Edit Expense' : 'Add Expense'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                {editId ? 'Update' : 'Add Expense'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Title *</label>
            <input type="text" placeholder="e.g. Grocery shopping" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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

export default Expense;
