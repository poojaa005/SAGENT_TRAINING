import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { goalService } from '../../services/goalService';
import Card from '../../components/card/Card';
import Modal from '../../components/modal/Modal';
import ProgressBar from '../../components/progressbar/ProgressBar';
import { formatCurrency, formatDate, getProgress } from '../../utils/formatters';
import '../income/Income.css';
import './Goals.css';
import '../../components/modal/Modal.css';

const defaultForm = { goalName: '', targetAmount: '', savedAmount: '', targetDate: '', status: 'ACTIVE' };

const Goals = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await goalService.getGoalsByUser(user.userId);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (g) => {
    setForm({ goalName: g.goalName, targetAmount: g.targetAmount, savedAmount: g.savedAmount, targetDate: g.targetDate, status: g.status || 'ACTIVE' });
    setEditId(g.goalId);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.goalName || !form.targetAmount || !form.targetDate) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        targetAmount: parseFloat(form.targetAmount),
        savedAmount: parseFloat(form.savedAmount || 0),
        user: { userId: user.userId },
      };
      if (editId) {
        await goalService.updateGoal(editId, payload);
      } else {
        await goalService.createGoal(user.userId, payload);
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try { await goalService.deleteGoal(id); fetchGoals(); } catch (err) { console.error(err); }
  };

  const activeGoals = goals.filter((g) => g.status !== 'COMPLETED');
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED');
  const totalTarget = goals.reduce((s, g) => s + (g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((s, g) => s + (g.savedAmount || 0), 0);

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <h1>Savings Goals</h1>
          <p>Track your progress toward financial goals</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Goal
        </button>
      </div>

      <div className="summary-cards">
        <Card label="Total Goals" value={goals.length} icon="fa-bullseye" color="purple" />
        <Card label="Active" value={activeGoals.length} icon="fa-spinner" color="blue" />
        <Card label="Completed" value={completedGoals.length} icon="fa-circle-check" color="green" />
        <Card label="Total Saved" value={formatCurrency(totalSaved)} icon="fa-piggy-bank" color="yellow" sub={`of ${formatCurrency(totalTarget)}`} />
      </div>

      {loading ? (
        <div className="table-empty" style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '48px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
        </div>
      ) : goals.length === 0 ? (
        <div className="table-empty" style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <i className="fas fa-bullseye" style={{ fontSize: '3rem', opacity: 0.25, display: 'block', marginBottom: '12px' }}></i>
          <p>No goals set yet</p>
          <small>Click "Add Goal" to create your first savings goal</small>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((g) => {
            const pct = getProgress(g.savedAmount, g.targetAmount);
            const isComplete = g.status === 'COMPLETED' || pct >= 100;
            return (
              <div className={`goal-card ${isComplete ? 'completed' : ''}`} key={g.goalId}>
                <div className="goal-card-header">
                  <div className="goal-card-title">
                    <h3>{g.goalName}</h3>
                    <span className={`badge ${isComplete ? 'badge-completed' : 'badge-active'}`}>
                      {isComplete ? '✓ Completed' : 'Active'}
                    </span>
                  </div>
                  <div className="action-btns">
                    <button className="btn-icon edit" onClick={() => openEdit(g)}><i className="fas fa-pen"></i></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(g.goalId)}><i className="fas fa-trash"></i></button>
                  </div>
                </div>

                <div className="goal-amounts">
                  <div className="g-saved">{formatCurrency(g.savedAmount)}</div>
                  <div className="g-target">of {formatCurrency(g.targetAmount)}</div>
                </div>

                <ProgressBar
                  percent={pct}
                  height={10}
                  color={isComplete ? 'green' : 'purple'}
                  leftLabel={`${pct}% saved`}
                  rightLabel={formatCurrency(g.targetAmount - g.savedAmount) + ' left'}
                />

                <div className="goal-meta">
                  <span><i className="fas fa-calendar-check"></i> Target: {formatDate(g.targetDate)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal
          title={editId ? 'Edit Goal' : 'Add Goal'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                {editId ? 'Update' : 'Add Goal'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Goal Name *</label>
            <input type="text" placeholder="e.g. Vacation Fund, Emergency Savings" value={form.goalName} onChange={(e) => setForm({ ...form, goalName: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Target Amount (₹) *</label>
              <input type="number" placeholder="0.00" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Saved So Far (₹)</label>
              <input type="number" placeholder="0.00" value={form.savedAmount} onChange={(e) => setForm({ ...form, savedAmount: e.target.value })} min="0" step="0.01" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Target Date *</label>
              <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Goals;
