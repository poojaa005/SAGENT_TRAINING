import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourses, createApplication, savePersonalDetails, saveAcademicDetails, uploadDocument } from '../../services/api';
import './Application.css';

const steps = ['Personal Details', 'Academic Details', 'Select Course', 'Upload Documents', 'Review & Submit'];

function Application() {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState(null);

  const [personal, setPersonal] = useState({ dob: '', address: '', phone_no: '' });
  const [academics, setAcademics] = useState([{ subject: '', grade: '' }]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [docType, setDocType] = useState('Marksheet');

  useEffect(() => {
    if (!student) { navigate('/login'); return; }
    getCourses().then(r => setCourses(r.data)).catch(() => {});
  }, [student, navigate]);

  const addAcademic = () => setAcademics([...academics, { subject: '', grade: '' }]);
  const updateAcademic = (i, field, val) => {
    const updated = [...academics];
    updated[i][field] = val;
    setAcademics(updated);
  };

  const handleSubmit = async () => {
    const selectedCourseInfo = courses.find(c => String(c.courseId) === String(selectedCourse));
    if (!selectedCourseInfo) { alert('Please select a course!'); return; }
    setLoading(true);
    try {
      // Create Application
      const appRes = await createApplication({ stId: student.stId, courseId: selectedCourseInfo.courseId, status: 'Pending' });
      const newAppId = appRes.data.appId;
      setAppId(newAppId);

      // Save Personal Details
      await savePersonalDetails({ stId: student.stId, ...personal });

      // Save Academic Details
      for (const ac of academics.filter(a => a.subject)) {
        await saveAcademicDetails({ appId: newAppId, subject: ac.subject, grade: ac.grade });
      }

      // Save Document record
      await uploadDocument({
        appId: newAppId,
        documentDate: new Date().toISOString().split('T')[0],
        documentType: docType,
        filePath: `/uploads/student_${student.stId}.pdf`
      });

      setSubmitted(true);
    } catch (err) {
      alert('Submission failed. Please check your connection and try again.');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="app-success page-wrapper">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Application Submitted!</h2>
          <p>Your application has been received successfully.</p>
          <div className="success-app-id">Application ID: <strong>#{appId}</strong></div>
          <p className="success-note">Our officers will review your application and you'll be notified of updates.</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate(`/payment/${appId}`)}>Pay Application Fee →</button>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-page page-wrapper">
      <div className="container">
        <div className="app-header">
          <h1>New Application</h1>
          <p>Complete all steps to submit your admission application</p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {steps.map((s, i) => (
            <div key={i} className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <div className="step-label">{s}</div>
              {i < steps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        <div className="app-form-card card">
          {/* Step 0: Personal */}
          {step === 0 && (
            <div className="form-step fade-in">
              <h2>Personal Information</h2>
              <p className="step-desc">Tell us about yourself</p>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input className="form-control" type="date" value={personal.dob}
                    onChange={e => setPersonal({ ...personal, dob: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-control" type="tel" placeholder="9876543210" value={personal.phone_no}
                    onChange={e => setPersonal({ ...personal, phone_no: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea className="form-control" rows={3} placeholder="Enter your full address"
                  value={personal.address} onChange={e => setPersonal({ ...personal, address: e.target.value })} required />
              </div>
            </div>
          )}

          {/* Step 1: Academic */}
          {step === 1 && (
            <div className="form-step fade-in">
              <h2>Academic Details</h2>
              <p className="step-desc">Enter your previous academic record</p>
              {academics.map((ac, i) => (
                <div key={i} className="form-grid-2 academic-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <input className="form-control" placeholder="e.g. Mathematics" value={ac.subject}
                      onChange={e => updateAcademic(i, 'subject', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Grade</label>
                    <select className="form-control" value={ac.grade}
                      onChange={e => updateAcademic(i, 'grade', e.target.value)}>
                      <option value="">Select Grade</option>
                      <option>A+</option><option>A</option><option>B+</option>
                      <option>B</option><option>C</option><option>D</option>
                    </select>
                  </div>
                </div>
              ))}
              <button type="button" className="btn-add" onClick={addAcademic}>+ Add Subject</button>
            </div>
          )}

          {/* Step 2: Course */}
          {step === 2 && (
            <div className="form-step fade-in">
              <h2>Select Your Course</h2>
              <p className="step-desc">Choose the program you wish to apply for</p>
              <div className="course-select-grid">
                {courses.map(c => (
                  <div
                    key={c.courseId}
                    className={`course-option ${String(selectedCourse) === String(c.courseId) ? 'selected' : ''}`}
                    onClick={() => setSelectedCourse(c.courseId)}
                  >
                    <div className="co-icon">{c.dept === 'IT' ? '💻' : c.dept === 'CSE' ? '🔬' : '📈'}</div>
                    <div className="co-name">{c.courseName}</div>
                    <div className="co-dept">{c.dept}</div>
                    <div className="co-duration">⏱ {c.duration}</div>
                    {String(selectedCourse) === String(c.courseId) && <div className="co-check">✓ Selected</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="form-step fade-in">
              <h2>Document Upload</h2>
              <p className="step-desc">Upload your supporting documents</p>
              <div className="form-group">
                <label>Document Type</label>
                <select className="form-control" value={docType} onChange={e => setDocType(e.target.value)}>
                  <option>Marksheet</option>
                  <option>ID Proof</option>
                  <option>Birth Certificate</option>
                  <option>Transfer Certificate</option>
                </select>
              </div>
              <div className="upload-area">
                <div className="upload-icon">📁</div>
                <h3>Upload Document</h3>
                <p>Drag & drop your file here or click to browse</p>
                <p className="upload-formats">Supported: PDF, JPG, PNG (Max 5MB)</p>
                <input type="file" className="file-input" accept=".pdf,.jpg,.png"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const name = e.target.files[0].name;
                      document.querySelector('.upload-filename').textContent = '✅ ' + name;
                    }
                  }} />
                <div className="upload-filename">No file selected</div>
              </div>
              <div className="doc-checklist">
                <h4>Required Documents Checklist</h4>
                <div className="cl-item"><span>☐</span> 10th Marksheet</div>
                <div className="cl-item"><span>☐</span> 12th Marksheet</div>
                <div className="cl-item"><span>☐</span> Government ID Proof</div>
                <div className="cl-item"><span>☐</span> Passport Size Photo</div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="form-step fade-in">
              <h2>Review Your Application</h2>
              <p className="step-desc">Please verify all details before submitting</p>
              <div className="review-sections">
                <div className="review-section">
                  <h4>Personal Details</h4>
                  <div className="review-row"><span>Date of Birth</span><strong>{personal.dob || 'Not provided'}</strong></div>
                  <div className="review-row"><span>Phone</span><strong>{personal.phone_no || 'Not provided'}</strong></div>
                  <div className="review-row"><span>Address</span><strong>{personal.address || 'Not provided'}</strong></div>
                </div>
                <div className="review-section">
                  <h4>Academic Details</h4>
                  {academics.filter(a => a.subject).map((a, i) => (
                    <div key={i} className="review-row">
                      <span>{a.subject}</span><strong>{a.grade}</strong>
                    </div>
                  ))}
                </div>
                <div className="review-section">
                  <h4>Selected Course</h4>
                  {courses.find(c => String(c.courseId) === String(selectedCourse)) ? (
                    <div className="review-row">
                      <span>Course</span>
                      <strong>{courses.find(c => String(c.courseId) === String(selectedCourse))?.courseName}</strong>
                    </div>
                  ) : <p style={{ color: 'red', fontSize: '0.9rem' }}>⚠️ No course selected!</p>}
                </div>
                <div className="review-section">
                  <h4>Document</h4>
                  <div className="review-row"><span>Type</span><strong>{docType}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="step-nav">
            {step > 0 && (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>← Back</button>
            )}
            {step < steps.length - 1 && (
              <button className="btn-primary" onClick={() => {
                if (step === 0 && (!personal.dob || !personal.address || !personal.phone_no)) {
                  alert('Please fill all personal details.'); return;
                }
                if (step === 2 && !courses.find(c => String(c.courseId) === String(selectedCourse))) {
                  alert('Please select a course before continuing.');
                  return;
                }
                setStep(step + 1);
              }}>Continue →</button>
            )}
            {step === steps.length - 1 && (
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Application;
