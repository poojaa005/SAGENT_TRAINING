import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getReviews } from '../../services/api';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import './Dashboard.css';

function Dashboard() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) { navigate('/login'); return; }
    let active = true;
    const loadData = async () => {
      try {
        const appRes = await getApplications();
        if (active) {
          const myApps = appRes.data.filter(a => a.student?.stId === student.stId || a.stId === student.stId);
          setApplications(myApps);
        }
      } catch {
        if (active) setApplications([]);
      }

      try {
        const revRes = await getReviews();
        if (active) setReviews(Array.isArray(revRes.data) ? revRes.data : []);
      } catch {
        if (active) setReviews([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => { active = false; };
  }, [student, navigate]);

  const myReview = (appId) => reviews.find(r => r.application?.appId === appId || r.appId === appId);

  const stats = [
    { icon: '📋', label: 'Applications', value: applications.length, color: '#3b82f6' },
    { icon: '✅', label: 'Approved', value: applications.filter(a => a.status === 'Approved').length, color: '#10b981' },
    { icon: '⏳', label: 'Pending', value: applications.filter(a => a.status === 'Pending').length, color: '#f59e0b' },
    { icon: '🔍', label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, color: '#8b5cf6' },
  ];

  if (loading) return <div className="loading-screen"><div className="loader"></div><p>Loading your dashboard...</p></div>;

  return (
    <div className="dashboard page-wrapper">
      {/* Header */}
      <div className="dash-header">
        <div className="container">
          <div className="dash-header-inner">
            <div>
              <p className="dash-welcome">Welcome back,</p>
              <h1 className="dash-name">{student?.name} 👋</h1>
              <p className="dash-email">{student?.email}</p>
            </div>
            <div className="dash-actions">
              <Link to="/apply" className="btn-primary">+ New Application</Link>
              <Link to="/ai-assistant" className="btn-ai-dash">✨ AI Help</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="dash-stats">
          {stats.map((s, i) => (
            <div key={i} className="dash-stat-card" style={{ '--accent-color': s.color }}>
              <div className="dsc-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div>
                <div className="dsc-value">{s.value}</div>
                <div className="dsc-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* Applications */}
          <div className="dash-section">
            <div className="ds-header">
              <h2>My Applications</h2>
              <Link to="/status">View All →</Link>
            </div>
            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Applications Yet</h3>
                <p>Start your admission journey by applying for a course.</p>
                <Link to="/apply" className="btn-primary" style={{ marginTop: '16px' }}>Apply Now</Link>
              </div>
            ) : (
              <div className="app-list">
                {applications.map((app) => {
                  const rev = myReview(app.appId);
                  return (
                    <div key={app.appId} className="app-item">
                      <div className="ai-info">
                        <div className="ai-id">Application #{app.appId}</div>
                        <div className="ai-course">{app.course?.courseName || `Course ID: ${app.courseId}`}</div>
                        {rev && <div className="ai-remark">💬 {rev.remarks}</div>}
                      </div>
                      <div className="ai-right">
                        <StatusBadge status={app.status} />
                        <button
                          className="btn-cancel"
                          onClick={async () => {
                            if (window.confirm('Cancel this application?')) {
                              const { deleteApplication } = await import('../../services/api');
                              await deleteApplication(app.appId);
                              setApplications(prev => prev.filter(a => a.appId !== app.appId));
                            }
                          }}
                        >Cancel</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="dash-section">
            <div className="ds-header"><h2>Quick Actions</h2></div>
            <div className="quick-links">
              <Link to="/apply" className="quick-link">
                <div className="ql-icon">📝</div>
                <div className="ql-text">
                  <div className="ql-title">New Application</div>
                  <div className="ql-sub">Apply for a course</div>
                </div>
                <span className="ql-arrow">→</span>
              </Link>
              <Link to="/status" className="quick-link">
                <div className="ql-icon">📊</div>
                <div className="ql-text">
                  <div className="ql-title">Track Status</div>
                  <div className="ql-sub">Monitor application progress</div>
                </div>
                <span className="ql-arrow">→</span>
              </Link>
              <Link to="/courses" className="quick-link">
                <div className="ql-icon">📚</div>
                <div className="ql-text">
                  <div className="ql-title">Browse Courses</div>
                  <div className="ql-sub">Explore available programs</div>
                </div>
                <span className="ql-arrow">→</span>
              </Link>
              <Link to="/ai-assistant" className="quick-link ai-quick">
                <div className="ql-icon">✨</div>
                <div className="ql-text">
                  <div className="ql-title">AI Assistant</div>
                  <div className="ql-sub">Get instant help</div>
                </div>
                <span className="ql-arrow">→</span>
              </Link>
            </div>

            {/* Profile Card */}
            <div className="profile-card">
              <div className="pc-avatar">{student?.name?.[0]?.toUpperCase()}</div>
              <div className="pc-info">
                <div className="pc-name">{student?.name}</div>
                <div className="pc-email">{student?.email}</div>
                <div className="pc-id">Student ID: #{student?.stId}</div>
              </div>
              <button className="btn-logout-dash" onClick={() => { logout(); navigate('/'); }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
