import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getAllStudents, getCourses, updateApplication, createReview, getReviews, getDocuments, createCourse } from '../../services/api';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import './OfficerDashboard.css';

const STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected'];

function OfficerDashboard() {
  const { officer, logout } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState('');
  const [updating, setUpdating] = useState(false);
  const [reviewServiceDown, setReviewServiceDown] = useState(false);
  const [courseForm, setCourseForm] = useState({ courseName: '', dept: '', duration: '' });
  const [addingCourse, setAddingCourse] = useState(false);

  useEffect(() => {
    if (!officer) { navigate('/officer/login'); return; }
    let active = true;
    const loadData = async () => {
      const results = await Promise.allSettled([
        getApplications(),
        getAllStudents(),
        getCourses(),
        getReviews(),
        getDocuments()
      ]);

      if (!active) return;

      setApps(results[0].status === 'fulfilled' && Array.isArray(results[0].value.data) ? results[0].value.data : []);
      setStudents(results[1].status === 'fulfilled' && Array.isArray(results[1].value.data) ? results[1].value.data : []);
      setCourses(results[2].status === 'fulfilled' && Array.isArray(results[2].value.data) ? results[2].value.data : []);

      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value.data)) {
        setReviews(results[3].value.data);
        setReviewServiceDown(false);
      } else {
        setReviews([]);
        setReviewServiceDown(true);
      }
      setDocuments(results[4].status === 'fulfilled' && Array.isArray(results[4].value.data) ? results[4].value.data : []);

      setLoading(false);
    };

    loadData();
    return () => { active = false; };
  }, [officer, navigate]);

  const getStudent = (stId) => students.find(s => s.stId === stId);
  const getCourse = (cId) => courses.find(c => c.courseId === cId);
  const getDocumentsByApp = (appId) => documents.filter(d => (d.appId || d.application?.appId) === appId);

  const filtered = filter === 'All' ? apps : apps.filter(a => a.status === filter);

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'Pending').length,
    review: apps.filter(a => a.status === 'Under Review').length,
    approved: apps.filter(a => a.status === 'Approved').length,
    rejected: apps.filter(a => a.status === 'Rejected').length,
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdating(true);
    try {
      const app = apps.find(a => a.appId === appId);
      await updateApplication(appId, { ...app, status: newStatus });
      setApps(prev => prev.map(a => a.appId === appId ? { ...a, status: newStatus } : a));
      if (selected?.appId === appId) setSelected(prev => ({ ...prev, status: newStatus }));

      try {
        await createReview({
          appId,
          officerId: officer.officerId,
          reviewStatus: newStatus,
          remarks: remark || `Status updated to ${newStatus}`
        });
        setRemark('');
        setReviewServiceDown(false);
      } catch {
        setReviewServiceDown(true);
      }
    } catch (err) {
      alert('Failed to update status.');
    } finally { setUpdating(false); }
  };

  const handleAddCourse = async () => {
    if (!courseForm.courseName || !courseForm.dept || !courseForm.duration) {
      alert('Please fill course name, department, and duration.');
      return;
    }
    setAddingCourse(true);
    try {
      const res = await createCourse(courseForm);
      if (res?.data) setCourses(prev => [...prev, res.data]);
      setCourseForm({ courseName: '', dept: '', duration: '' });
      alert('Course added successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add course. Please check backend course API validation.');
    } finally {
      setAddingCourse(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div><p>Loading dashboard...</p></div>;

  return (
    <div className="officer-dashboard page-wrapper">
      {/* Header */}
      <div className="od-header">
        <div className="container">
          <div className="od-header-inner">
            <div>
              <div className="od-role">🏛️ Admission Officer</div>
              <h1>{officer?.officerName}</h1>
              <div className="od-email">{officer?.officerGmail}</div>
            </div>
            <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div className="container">
        {reviewServiceDown && (
          <div className="empty-state" style={{ marginBottom: '16px', padding: '12px 16px', textAlign: 'left' }}>
            Review service is currently unavailable. Application data is loaded, but review history/remarks may be missing.
          </div>
        )}

        {/* Stats */}
        <div className="od-stats">
          {[
            { l: 'Total Applications', v: stats.total, c: '#3b82f6', i: '📋' },
            { l: 'Pending', v: stats.pending, c: '#f59e0b', i: '⏳' },
            { l: 'Under Review', v: stats.review, c: '#8b5cf6', i: '🔍' },
            { l: 'Approved', v: stats.approved, c: '#10b981', i: '✅' },
            { l: 'Rejected', v: stats.rejected, c: '#ef4444', i: '❌' },
          ].map((s, i) => (
            <div key={i} className="od-stat" style={{ '--c': s.c }}>
              <div className="ods-icon" style={{ background: s.c + '18', color: s.c }}>{s.i}</div>
              <div className="ods-val">{s.v}</div>
              <div className="ods-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="od-filters">
          {['All', ...STATUSES].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="odd-section" style={{ marginBottom: '16px' }}>
          <h4>Add New Course</h4>
          <div className="form-group">
            <label>Course Name</label>
            <input
              className="form-control"
              placeholder="e.g. B.Sc Computer Science"
              value={courseForm.courseName}
              onChange={(e) => setCourseForm(prev => ({ ...prev, courseName: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              className="form-control"
              placeholder="e.g. Science"
              value={courseForm.dept}
              onChange={(e) => setCourseForm(prev => ({ ...prev, dept: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              className="form-control"
              placeholder="e.g. 3 Years"
              value={courseForm.duration}
              onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
            />
          </div>
          <button className="btn-primary" onClick={handleAddCourse} disabled={addingCourse}>
            {addingCourse ? 'Adding...' : 'Add Course'}
          </button>
        </div>

        <div className="od-grid">
          {/* Applications List */}
          <div className="od-list">
            <h3>Applications ({filtered.length})</h3>
            <div className="od-apps">
              {filtered.map(app => {
                const stu = getStudent(app.stId || app.student?.stId);
                const course = getCourse(app.courseId || app.course?.courseId);
                return (
                  <div
                    key={app.appId}
                    className={`od-app-item ${selected?.appId === app.appId ? 'active' : ''}`}
                    onClick={() => setSelected(app)}
                  >
                    <div className="oai-top">
                      <div className="oai-id">#{app.appId}</div>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="oai-student">{stu?.name || 'Unknown Student'}</div>
                    <div className="oai-course">{course?.courseName || 'Unknown Course'}</div>
                    <div className="oai-email">{stu?.email}</div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <div className="empty-icon">📋</div>
                  <p>No applications in this category</p>
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="od-detail">
            {!selected ? (
              <div className="od-placeholder">
                <div className="op-icon">👈</div>
                <h3>Select an Application</h3>
                <p>Click on any application to view details and take action</p>
              </div>
            ) : (() => {
              const stu = getStudent(selected.stId || selected.student?.stId);
              const course = getCourse(selected.courseId || selected.course?.courseId);
              const appDocs = getDocumentsByApp(selected.appId);
              return (
                <div className="fade-in">
                  <div className="odd-header">
                    <h3>Application #{selected.appId}</h3>
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="odd-section">
                    <h4>Student Information</h4>
                    <div className="odd-student-info">
                      <div className="osi-avatar">{stu?.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="osi-name">{stu?.name}</div>
                        <div className="osi-email">{stu?.email}</div>
                        <div className="osi-id">Student ID: #{stu?.stId}</div>
                      </div>
                    </div>
                  </div>

                  <div className="odd-section">
                    <h4>Course Applied</h4>
                    <div className="odd-row"><span>Course</span><strong>{course?.courseName}</strong></div>
                    <div className="odd-row"><span>Department</span><strong>{course?.dept}</strong></div>
                    <div className="odd-row"><span>Duration</span><strong>{course?.duration}</strong></div>
                  </div>

                  <div className="odd-section">
                    <h4>Submitted Documents</h4>
                    {appDocs.length === 0 ? (
                      <p style={{ color: '#64748b', margin: 0 }}>No document records found for this application.</p>
                    ) : (
                      appDocs.map((d) => (
                        <div key={d.documentId || `${d.appId}-${d.documentType}`} className="odd-row">
                          <span>{d.documentType} ({d.documentDate})</span>
                          <strong>{d.filePath || 'No file path'}</strong>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="odd-section">
                    <h4>Review Action</h4>
                    <div className="form-group">
                      <label>Remarks</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Add review remarks..."
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                      />
                    </div>
                    <div className="odd-actions">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          className={`btn-status ${s.toLowerCase().replace(' ', '-')} ${selected.status === s ? 'current' : ''}`}
                          onClick={() => handleStatusUpdate(selected.appId, s)}
                          disabled={updating || selected.status === s}
                        >
                          {s === 'Approved' ? '✅' : s === 'Rejected' ? '❌' : s === 'Under Review' ? '🔍' : '⏳'} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficerDashboard;
