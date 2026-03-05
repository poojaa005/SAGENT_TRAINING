import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Courses.css';

const icons = { 'IT': '💻', 'CSE': '🔬', 'Management': '📈', 'default': '📚' };
const colors = ['#e94560', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function Courses() {
  const { student } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const applyPath = student ? '/apply' : '/login';

  useEffect(() => {
    getCourses().then(r => { setCourses(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const depts = ['All', ...new Set(courses.map(c => c.dept))];
  const filtered = filter === 'All' ? courses : courses.filter(c => c.dept === filter);

  return (
    <div className="courses-page page-wrapper">
      <div className="courses-hero">
        <div className="container">
          <p className="section-tag">OUR PROGRAMS</p>
          <h1>Explore Our Courses</h1>
          <p>Find the perfect program to kickstart your career. World-class faculty, modern curriculum.</p>
        </div>
      </div>

      <div className="container">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {depts.map(d => (
            <button
              key={d}
              className={`filter-tab ${filter === d ? 'active' : ''}`}
              onClick={() => setFilter(d)}
            >{d}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: '300px' }}>
            <div className="loader"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((c, i) => (
              <div key={c.courseId} className="course-card" style={{ '--card-color': colors[i % colors.length] }}>
                <div className="cc-top">
                  <div className="cc-icon">{icons[c.dept] || icons.default}</div>
                  <div className="cc-badge">{c.dept}</div>
                </div>
                <h3 className="cc-name">{c.courseName}</h3>
                <div className="cc-details">
                  <div className="cc-detail"><span>⏱</span> {c.duration}</div>
                  <div className="cc-detail"><span>🏛️</span> {c.dept} Department</div>
                  <div className="cc-detail"><span>📋</span> Regular Program</div>
                </div>
                <div className="cc-highlights">
                  <div className="cc-highlight">Industry Ready</div>
                  <div className="cc-highlight">100% Placement</div>
                </div>
                <Link to={applyPath} className="cc-apply">Apply Now →</Link>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="courses-info-banner">
          <div className="cib-content">
            <h3>Not sure which course to choose?</h3>
            <p>Our AI assistant can help you pick the right program based on your interests and career goals.</p>
            <Link to="/ai-assistant" className="btn-primary">Ask AI Assistant ✨</Link>
          </div>
          <div className="cib-icon">🤖</div>
        </div>
      </div>
    </div>
  );
}

export default Courses;

