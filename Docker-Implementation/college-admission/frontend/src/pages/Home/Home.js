import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const stats = [
  { value: '5,000+', label: 'Students Enrolled' },
  { value: '50+', label: 'Courses Available' },
  { value: '98%', label: 'Acceptance Rate' },
  { value: '24/7', label: 'Support Available' },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Register with your email and basic details to get started.', icon: '👤' },
  { num: '02', title: 'Fill Application', desc: 'Enter personal, academic details and choose your desired course.', icon: '📝' },
  { num: '03', title: 'Upload Documents', desc: 'Upload your marksheets, ID proof and other required documents.', icon: '📁' },
  { num: '04', title: 'Pay & Submit', desc: 'Pay the application fee and submit your application.', icon: '💳' },
  { num: '05', title: 'Track Status', desc: 'Monitor your application status in real time from your dashboard.', icon: '📊' },
];

const testimonials = [
  { name: 'Priya Krishnan', course: 'B.Tech CSE', text: 'The process was so smooth! I got my acceptance letter within a week.', avatar: 'P' },
  { name: 'Arjun Mehta', course: 'BBA', text: 'The AI assistant helped me understand every step of the admission process.', avatar: 'A' },
  { name: 'Sneha Patel', course: 'B.Tech IT', text: 'Best digital admission experience I have had. Highly recommend!', avatar: 'S' },
];

function Home() {
  const { student } = useAuth();
  const [courses, setCourses] = useState([]);
  const applyPath = student ? '/apply' : '/login';

  useEffect(() => {
    getCourses().then(r => setCourses(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1"></div>
          <div className="hero-orb orb2"></div>
          <div className="hero-orb orb3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">🎓 Digital Admissions 2026</div>
          <h1 className="hero-title">
            Your Journey to<br />
            <span className="hero-accent">Academic Excellence</span><br />
            Starts Here
          </h1>
          <p className="hero-desc">
            Apply to your dream college with ease. Our digital platform makes the entire 
            admission process seamless, transparent, and stress-free.
          </p>
          <div className="hero-actions">
            <Link to={applyPath} className="btn-hero-primary">Start Your Application →</Link>
            <Link to="/courses" className="btn-hero-secondary">Explore Courses</Link>
          </div>
          <div className="hero-trust">
            <span>✅ Trusted by 5000+ students</span>
            <span>🔒 Secure & Private</span>
            <span>⚡ Instant Updates</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card floating-card card1">
            <span className="fc-icon">🎉</span>
            <div>
              <div className="fc-title">Application Approved!</div>
              <div className="fc-sub">B.Tech CSE — Rahul S.</div>
            </div>
          </div>
          <div className="hero-card floating-card card2">
            <span className="fc-icon">📊</span>
            <div>
              <div className="fc-title">Applications Today</div>
              <div className="fc-sub">+248 new submissions</div>
            </div>
          </div>
          <div className="hero-card floating-card card3">
            <span className="fc-icon">✨</span>
            <div>
              <div className="fc-title">AI Assistant</div>
              <div className="fc-sub">Available 24/7 for help</div>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="grad-circle gc1"></div>
            <div className="grad-circle gc2"></div>
            <div className="hero-center-icon">🎓</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">HOW IT WORKS</p>
            <h2 className="section-title">Simple 5-Step Process</h2>
            <p className="section-subtitle">From registration to acceptance — everything in one place</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="step-connector">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      {courses.length > 0 && (
        <section className="courses-preview">
          <div className="container">
            <div className="section-header">
              <p className="section-tag">OUR PROGRAMS</p>
              <h2 className="section-title">Featured Courses</h2>
            </div>
            <div className="preview-courses-grid">
              {courses.map((c, i) => (
                <div key={c.courseId || i} className="preview-course-card">
                  <div className="pc-icon">{i === 0 ? '💻' : i === 1 ? '🔬' : '📈'}</div>
                  <div className="pc-dept">{c.dept}</div>
                  <h3 className="pc-name">{c.courseName}</h3>
                  <div className="pc-duration">⏱ {c.duration}</div>
                  <Link to={applyPath} className="pc-apply">Apply Now →</Link>
                </div>
              ))}
            </div>
            <div className="courses-cta">
              <Link to="/courses" className="btn-primary">View All Courses</Link>
            </div>
          </div>
        </section>
      )}

      {/* AI Feature */}
      <section className="ai-feature">
        <div className="container">
          <div className="ai-feature-inner">
            <div className="ai-content">
              <p className="section-tag">POWERED BY GEMINI AI</p>
              <h2>Your Personal Admission Assistant</h2>
              <p>Get instant answers to all your admission queries. Our AI assistant, powered by Google Gemini, is trained to help you navigate the entire admission process — from choosing the right course to submitting documents.</p>
              <ul className="ai-features-list">
                <li>✅ Course recommendations based on your profile</li>
                <li>✅ Document checklist guidance</li>
                <li>✅ Application tips and deadlines</li>
                <li>✅ Scholarship information</li>
              </ul>
              <Link to="/ai-assistant" className="btn-ai">Chat with AI Assistant ✨</Link>
            </div>
            <div className="ai-visual">
              <div className="ai-chat-preview">
                <div className="acp-header">
                  <div className="acp-avatar">🤖</div>
                  <div><div className="acp-name">EduAdmit AI</div><div className="acp-status">● Online</div></div>
                </div>
                <div className="acp-messages">
                  <div className="acp-msg bot">Hello! I'm here to help with your college admission. What would you like to know?</div>
                  <div className="acp-msg user">Which course is best for a career in software?</div>
                  <div className="acp-msg bot">Great choice! B.Tech CSE or B.Tech IT would be perfect for a software career. CSE covers core algorithms, while IT focuses on practical systems...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">STUDENT STORIES</p>
            <h2 className="section-title">What Students Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="tc-stars">★★★★★</div>
                <p className="tc-text">"{t.text}"</p>
                <div className="tc-author">
                  <div className="tc-avatar">{t.avatar}</div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-course">{t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Begin Your Academic Journey?</h2>
          <p>Join thousands of students who chose EduAdmit for a seamless admission experience.</p>
          <div className="cta-actions">
            <Link to={applyPath} className="btn-cta-primary">Apply Now — It's Free</Link>
            <Link to="/ai-assistant" className="btn-cta-secondary">Talk to AI First ✨</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

