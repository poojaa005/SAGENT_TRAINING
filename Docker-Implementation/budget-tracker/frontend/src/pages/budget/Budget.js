import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { budgetService } from '../../services/budgetService';
import { expenseService } from '../../services/expenseService';
import Card from '../../components/card/Card';
import Modal from '../../components/modal/Modal';
import ProgressBar from '../../components/progressbar/ProgressBar';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../income/Income.css';
import './Budget.css';
import '../../components/modal/Modal.css';

const defaultForm = { totalAmount: '', month: '', startDate: '', endDate: '' };

const Budget = () => {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([
        budgetService.getBudgetsByUser(user.userId),
        expenseService.getExpensesByUser(user.userId),
      ]);
      setBudgets(bRes.data);
      setExpenses(eRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getSpentForBudget = (budget) => {
    return expenses.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);
      return d >= start && d <= end;
    }).reduce((s, e) => s + (e.amount || 0), 0);
  };

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (b) => {
    setForm({ totalAmount: b.totalAmount, month: b.month, startDate: b.startDate, endDate: b.endDate });
    setEditId(b.budgetId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.totalAmount || !form.month || !form.startDate || !form.endDate) return;
    setSaving(true);
    try {
      const payload = { ...form, totalAmount: parseFloat(form.totalAmount), user: { userId: user.userId } };
      if (editId) {
        await budgetService.updateBudget(editId, payload);
      } else {
        await budgetService.createBudget(user.userId, payload);
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
    if (!window.confirm('Delete this budget?')) return;
    try { await budgetService.deleteBudget(id); fetchData(); } catch (err) { console.error(err); }
  };

  const totalBudgeted = budgets.reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <h1>Budget</h1>
          <p>Set and track your monthly spending limits</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Budget
        </button>
      </div>

      <div className="summary-cards">
        <Card label="Total Budgets" value={budgets.length} icon="fa-wallet" color="purple" sub="active budgets" />
        <Card label="Total Budgeted" value={formatCurrency(totalBudgeted)} icon="fa-money-bill" color="blue" />
      </div>

      {loading ? (
        <div className="table-empty" style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '48px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
        </div>
      ) : budgets.length === 0 ? (
        <div className="table-empty" style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <i className="fas fa-wallet" style={{ fontSize: '3rem', opacity: 0.25, display: 'block', marginBottom: '12px' }}></i>
          <p>No budgets set yet</p>
          <small>Click "Add Budget" to create your first monthly budget</small>
        </div>
      ) : (
        <div className="budget-cards-grid">
          {budgets.map((b) => {
            const spent = getSpentForBudget(b);
            const pct = b.totalAmount > 0 ? Math.min(Math.round((spent / b.totalAmount) * 100), 100) : 0;
            const overBudget = spent > b.totalAmount;
            return (
              <div className="budget-card" key={b.budgetId}>
                <div className="budget-card-header">
                  <div>
                    <h3>{b.month}</h3>
                    <p>Budget Period</p>
                  </div>
                  <div className="action-btns">
                    <button className="btn-icon edit" onClick={() => openEdit(b)}><i className="fas fa-pen"></i></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(b.budgetId)}><i className="fas fa-trash"></i></button>
                  </div>
                </div>

                <div className="budget-amount">{formatCurrency(b.totalAmount)}</div>

                <ProgressBar
                  percent={pct}
                  height={10}
                  color={overBudget ? 'red' : pct > 75 ? 'yellow' : 'green'}
                  leftLabel={`Spent: ${formatCurrency(spent)}`}
                  rightLabel={`${pct}%`}
                />

                {overBudget && (
                  <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', marginTop: '10px', fontWeight: 600 }}>
                    <i className="fas fa-triangle-exclamation"></i> Over budget by {formatCurrency(spent - b.totalAmount)}
                  </div>
                )}

                <div className="budget-dates">
                  <span><i className="fas fa-calendar-day"></i> {formatDate(b.startDate)}</span>
                  <span>→</span>
                  <span>{formatDate(b.endDate)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal
          title={editId ? 'Edit Budget' : 'Add Budget'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                {editId ? 'Update' : 'Add Budget'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Month Label *</label>
            <input type="text" placeholder="e.g. January 2026" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Total Budget Amount (₹) *</label>
            <input type="number" placeholder="0.00" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} min="0" step="0.01" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Budget;
