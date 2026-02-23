import React, { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../../context/UserContext';
import { incomeService } from '../../services/incomeService';
import { expenseService } from '../../services/expenseService';
import { goalService } from '../../services/goalService';
import Card from '../../components/card/Card';
import ProgressBar from '../../components/progressbar/ProgressBar';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/formatters';
import './Home.css';

const COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
const getCategoryName = (category) => category?.categoryName || category?.name || 'Other';

const Home = () => {
  const { user } = useUser();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [incRes, expRes, goalRes] = await Promise.all([
        incomeService.getIncomeByUser(user.userId),
        expenseService.getExpensesByUser(user.userId),
        goalService.getGoalsByUser(user.userId),
      ]);
      setIncomes(incRes.data);
      setExpenses(expRes.data);
      setGoals(goalRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const categoryData = expenses.reduce((acc, exp) => {
    const cat = getCategoryName(exp.category);
    const existing = acc.find((a) => a.name === cat);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: cat, value: exp.amount });
    }
    return acc;
  }, []);

  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const recentIncomes = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  if (loading) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Good day, {user?.name?.split(' ')[0]}!</h1>
        <p>Here's your financial overview for today.</p>
      </div>

      <div className="balance-highlight">
        <div className="balance-highlight-left">
          <h2>Current Balance</h2>
          <div className="balance-amount">{formatCurrency(balance)}</div>
        </div>
        <div className="balance-highlight-right">
          <i className="fas fa-coins"></i>
        </div>
      </div>

      <div className="stat-cards-grid">
        <Card label="Total Income" value={formatCurrency(totalIncome)} icon="fa-arrow-trend-up" color="green" sub={`${incomes.length} entries`} />
        <Card label="Total Expenses" value={formatCurrency(totalExpenses)} icon="fa-arrow-trend-down" color="red" sub={`${expenses.length} entries`} />
        <Card label="Savings Goals" value={goals.length} icon="fa-bullseye" color="purple" sub="active goals" />
        <Card label="Net Savings" value={formatCurrency(Math.max(balance, 0))} icon="fa-piggy-bank" color="yellow" sub="balance remaining" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-title">
            <i className="fas fa-chart-pie"></i> Expense Breakdown
          </div>
          {categoryData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-chart-pie"></i>
              <p>No expense data yet</p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-title">
            <i className="fas fa-receipt"></i> Recent Expenses
          </div>
          {recentExpenses.length > 0 ? (
            <div className="recent-list">
              {recentExpenses.map((exp) => {
                const categoryName = getCategoryName(exp.category);
                return (
                  <div className="recent-item" key={exp.expenseId}>
                    <div className="recent-icon" style={{ background: `${getCategoryColor(categoryName)}20`, color: getCategoryColor(categoryName) }}>
                      <i className="fas fa-receipt"></i>
                    </div>
                    <div className="recent-info">
                      <h4>{exp.title}</h4>
                      <p>{categoryName} | {formatDate(exp.date)}</p>
                    </div>
                    <div className="recent-amount expense">-{formatCurrency(exp.amount)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-receipt"></i>
              <p>No expenses recorded yet</p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-title">
            <i className="fas fa-arrow-trend-up"></i> Recent Income
          </div>
          {recentIncomes.length > 0 ? (
            <div className="recent-list">
              {recentIncomes.map((inc) => (
                <div className="recent-item" key={inc.incomeId}>
                  <div className="recent-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                    <i className="fas fa-coins"></i>
                  </div>
                  <div className="recent-info">
                    <h4>{inc.source || 'Income'}</h4>
                    <p>{formatDate(inc.date)}</p>
                  </div>
                  <div className="recent-amount income">+{formatCurrency(inc.amount)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-coins"></i>
              <p>No income recorded yet</p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-title">
            <i className="fas fa-bullseye"></i> Goals Progress
          </div>
          {goals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {goals.slice(0, 4).map((g) => {
                const pct = Math.min(Math.round((g.savedAmount / g.targetAmount) * 100), 100);
                return (
                  <div key={g.goalId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{g.goalName}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <ProgressBar percent={pct} height={8} color={pct >= 100 ? 'green' : 'purple'} showLabel={false} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>{formatCurrency(g.savedAmount)}</span>
                      <span>{formatCurrency(g.targetAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-bullseye"></i>
              <p>No goals set yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
