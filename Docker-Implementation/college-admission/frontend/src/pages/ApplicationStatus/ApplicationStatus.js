import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getReviews, getCourses } from '../../services/api';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import './ApplicationStatus.css';

function ApplicationStatus() {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!student) { navigate('/login'); return; }
    let active = true;
    const loadData = async () => {
      let myApps = [];

      try {
        const a = await getApplications();
        myApps = a.data.filter(ap => ap.student?.stId === student.stId || ap.stId === student.stId);
        if (active) {
          setApplications(myApps);
          if (myApps.length) setSelected(myApps[0]);
        }
      } catch {
        if (active) setApplications([]);
      }

      try {
        const c = await getCourses();
        if (active) setCourses(Array.isArray(c.data) ? c.data : []);
      } catch {
        if (active) setCourses([]);
      }

      try {
        const r = await getReviews();
        if (active) setReviews(Array.isArray(r.data) ? r.data : []);
      } catch {
        if (active) setReviews([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => { active = false; };
  }, [student, navigate]);

  const getReview = (appId) => reviews.find(r => r.application?.appId === appId || r.appId === appId);
  const getCourse = (courseId) => courses.find(c => c.courseId === courseId);

  const getTimeline = (status) => {
    const stages = ['Submitted', 'Under Review', 'Decision', 'Enrolled'];
    const statusMap = { 'Pending': 1, 'Under Review': 2, 'Approved': 3, 'Accepted': 4, 'Rejected': 3 };
    return { stages, current: statusMap[status] || 1 };
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div><p>Loading status...</p></div>;

  return (
    <div className="status-page page-wrapper">
      <div className="status-header">
        <div className="container">
          <h1>Application Status</h1>
          <p>Track the progress of your admission applications in real time</p>
        </div>
      </div>

      <div className="container">
        {applications.length === 0 ? (
          <div className="empty-state" style={{ padding: '80px 20px', background: '#fff', borderRadius: '16px', marginTop: '32px' }}>
            <div className="empty-icon">📭</div>
            <h3>No Applications Found</h3>
            <p>You haven't submitted any applications yet.</p>
            <button className="btn-primary" onClick={() => navigate('/apply')} style={{ marginTop: '20px' }}>Apply Now</button>
          </div>
        ) : (
          <div className="status-grid">
            {/* Sidebar */}
            <div className="status-sidebar">
              <h3>Your Applications</h3>
              {applications.map(app => {
                const course = getCourse(app.courseId || app.course?.courseId);
                return (
                  <div
                    key={app.appId}
                    className={`app-sidebar-item ${selected?.appId === app.appId ? 'active' : ''}`}
                    onClick={() => setSelected(app)}
                  >
                    <div className="asi-id">#{app.appId}</div>
                    <div className="asi-course">{course?.courseName || 'Unknown Course'}</div>
                    <StatusBadge status={app.status} />
                  </div>
                );
              })}
            </div>

            {/* Detail */}
            {selected && (() => {
              const rev = getReview(selected.appId);
              const course = getCourse(selected.courseId || selected.course?.courseId);
              const { stages, current } = getTimeline(selected.status);
              return (
                <div className="status-detail">
                  <div className="sd-header">
                    <div>
                      <h2>Application #{selected.appId}</h2>
                      <div className="sd-course">{course?.courseName}</div>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  {/* Timeline */}
                  <div className="timeline-card">
                    <h4>Application Progress</h4>
                    <div className="timeline">
                      {stages.map((stage, i) => (
                        <div key={i} className={`timeline-step ${i + 1 <= current ? 'done' : ''} ${i + 1 === current ? 'current' : ''}`}>
                          <div className="tl-circle">{i + 1 <= current ? '✓' : i + 1}</div>
                          <div className="tl-label">{stage}</div>
                          {i < stages.length - 1 && <div className="tl-line"></div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Info */}
                  {rev && (
                    <div className="review-info-card">
                      <h4>Officer Review</h4>
                      <div className="ric-content">
                        <div className="ric-row"><span>Status</span><StatusBadge status={rev.reviewStatus} /></div>
                        <div className="ric-row"><span>Remarks</span><strong>{rev.remarks}</strong></div>
                        <div className="ric-row"><span>Officer ID</span><strong>#{rev.officerId || rev.officer?.officerId}</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Course Info */}
                  {course && (
                    <div className="course-info-card">
                      <h4>Course Details</h4>
                      <div className="ric-content">
                        <div className="ric-row"><span>Course</span><strong>{course.courseName}</strong></div>
                        <div className="ric-row"><span>Department</span><strong>{course.dept}</strong></div>
                        <div className="ric-row"><span>Duration</span><strong>{course.duration}</strong></div>
                      </div>
                    </div>
                  )}

                  {selected.status === 'Pending' && (
                    <div className="action-box">
                      <p>💡 While waiting, you can complete your fee payment.</p>
                      <button className="btn-primary" onClick={() => navigate(`/payment/${selected.appId}`)}>Pay Fee →</button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationStatus;
