import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import healthRecordService from '../../services/healthRecordService';
import './Appointments.css';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recordEditId, setRecordEditId] = useState(null);
  const [recordEditForm, setRecordEditForm] = useState({
    recordType: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: ''
  });
  const [consultationForm, setConsultationForm] = useState({
    recordType: 'CONSULTATION',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: ''
  });
  const [feedbackValue, setFeedbackValue] = useState(null);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Form data for creating appointment (for patients)
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: ''
  });

  const [doctors, setDoctors] = useState([]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      let data = [];
      if (user?.role === 'PATIENT') {
        data = await appointmentService.getPatientAppointments(user.id);
      } else if (user?.role === 'DOCTOR') {
        data = await appointmentService.getDoctorAppointments(user.id);
      }
      setAppointments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  }, [user]);

  const fetchDoctors = useCallback(async () => {
    try {
      const data = await appointmentService.getAllDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch doctors');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setAppointments([]);
        setDoctors([]);
        setLoading(false);
        return;
      }

      await fetchAppointments();
      if (user.role === 'PATIENT') {
        await fetchDoctors();
      } else {
        setDoctors([]);
      }
    };

    loadData();
  }, [user, fetchAppointments, fetchDoctors]);

  const fetchHealthRecords = async (patientId) => {
    try {
      const data = await healthRecordService.getPatientHealthRecords(patientId);
      setHealthRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch health records', err);
    }
  };

  const normalizeStatus = (status) => String(status || '').trim().toUpperCase();

  const isCancellableStatus = (status) => {
    const normalized = normalizeStatus(status);
    return ['SCHEDULED', 'BOOKED', 'PENDING', 'CONFIRMED'].includes(normalized);
  };

  const getCurrentPatientId = (appointment) =>
    appointment?.patientId || appointment?.patient?.patientId || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm({
      ...appointmentForm,
      [name]: value
    });
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const combinedDateTime = `${appointmentForm.appointmentDate}T${appointmentForm.appointmentTime}`;
      const appointmentData = {
        appointmentDate: appointmentForm.appointmentDate,
        appointmentTime: appointmentForm.appointmentTime,
        appointmentDateTime: combinedDateTime,
        reason: appointmentForm.reason,
        notes: appointmentForm.notes,
        appointmentStatus: 'SCHEDULED'
      };

      await appointmentService.bookAppointment({
        doctorId: appointmentForm.doctorId,
        patientId: user.id,
        appointmentData
      });
      setSuccess('Appointment created successfully!');
      setShowCreateModal(false);
      setAppointmentForm({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: ''
      });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        setSuccess('Appointment cancelled successfully!');
        fetchAppointments();
        setShowDetailsModal(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  const handleViewDetails = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
    setRecordEditId(null);
    setFeedbackValue(null);
    setFeedbackForm({ rating: 5, comment: '' });
    
    // Fetch health records if doctor is viewing
    if (user?.role === 'DOCTOR') {
      const patientId = getCurrentPatientId(appointment);
      if (patientId) {
        await fetchHealthRecords(patientId);
      } else {
        setHealthRecords([]);
      }
    }

    if (user?.role === 'PATIENT') {
      try {
        const appointmentId = appointment.id || appointment.appointmentId;
        const feedback = await appointmentService.getAppointmentFeedback(appointmentId);
        if (feedback) {
          setFeedbackValue(feedback);
          setFeedbackForm({
            rating: Number(feedback.rating || 5),
            comment: feedback.comment || feedback.notes || ''
          });
        }
      } catch (err) {
        console.error('Failed to load feedback', err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
      case 'SCHEDULED':
      case 'BOOKED':
      case 'PENDING':
      case 'CONFIRMED':
        return 'status-scheduled';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) {
      return { date: 'N/A', time: 'N/A' };
    }
    const date = new Date(dateTimeString);
    if (Number.isNaN(date.getTime())) {
      return { date: 'N/A', time: 'N/A' };
    }
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const normalizeStatusForFilter = (status) => {
    const normalized = normalizeStatus(status);
    if (['SCHEDULED', 'BOOKED', 'PENDING', 'CONFIRMED'].includes(normalized)) return 'SCHEDULED';
    if (normalized === 'COMPLETED') return 'COMPLETED';
    if (normalized === 'CANCELLED') return 'CANCELLED';
    return 'OTHER';
  };

  const normalizeDateValue = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.year && value.monthValue && value.dayOfMonth) {
      const month = String(value.monthValue).padStart(2, '0');
      const day = String(value.dayOfMonth).padStart(2, '0');
      return `${value.year}-${month}-${day}`;
    }
    return null;
  };

  const normalizeTimeValue = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.hour != null && value.minute != null) {
      const hour = String(value.hour).padStart(2, '0');
      const minute = String(value.minute).padStart(2, '0');
      const second = String(value.second || 0).padStart(2, '0');
      return `${hour}:${minute}:${second}`;
    }
    return null;
  };

  const getAppointmentDateTime = (appointment) => {
    const rawDateTime = appointment.appointmentDateTime || appointment.dateTime;
    const rawDate = normalizeDateValue(appointment.appointmentDate || appointment.date);
    const rawTime = normalizeTimeValue(appointment.appointmentTime || appointment.time);

    if (rawDateTime) {
      return formatDateTime(rawDateTime);
    }

    if (rawDate && rawTime) {
      return formatDateTime(`${rawDate}T${rawTime}`);
    }

    return {
      date: rawDate || 'N/A',
      time: rawTime || 'N/A'
    };
  };

  const filteredAppointments =
    statusFilter === 'ALL'
      ? appointments
      : appointments.filter((appointment) =>
          normalizeStatusForFilter(appointment.status || appointment.appointmentStatus) === statusFilter
        );

  const handleRecordEditStart = (record) => {
    setRecordEditId(record.recordId || record.id);
    setRecordEditForm({
      recordType: record.recordType || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      prescription: record.prescription || '',
      notes: record.notes || ''
    });
  };

  const handleRecordEditSave = async () => {
    if (!recordEditId) return;

    try {
      await healthRecordService.updateHealthRecord(recordEditId, recordEditForm);
      const patientId = getCurrentPatientId(selectedAppointment);
      if (patientId) {
        await fetchHealthRecords(patientId);
      }
      setRecordEditId(null);
      setSuccess('Patient health record updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update health record');
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    const patientId = getCurrentPatientId(selectedAppointment);
    if (!patientId) {
      setError('Patient ID not found for this appointment.');
      return;
    }

    try {
      const payload = {
        ...consultationForm,
        recordType: consultationForm.recordType || 'CONSULTATION',
        recordDate: new Date().toISOString().split('T')[0],
      };
      await healthRecordService.addHealthRecord(patientId, payload);
      await fetchHealthRecords(patientId);
      setConsultationForm({
        recordType: 'CONSULTATION',
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: ''
      });
      setSuccess('Consultation added to patient records.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add consultation');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    setFeedbackSubmitting(true);

    try {
      const appointmentId = selectedAppointment.id || selectedAppointment.appointmentId;
      const payload = {
        rating: Number(feedbackForm.rating || 0),
        comment: feedbackForm.comment || '',
        patientId: user?.id,
      };

      const response = await appointmentService.submitAppointmentFeedback(appointmentId, payload);
      setFeedbackValue(response || payload);
      setSuccess('Feedback submitted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h1>Appointments</h1>
        {user?.role === 'PATIENT' && (
          <button 
            className="btn-create-appointment"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Appointment
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="appointments-filters">
        <button
          className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All
        </button>
        <button
          className={`filter-btn ${statusFilter === 'SCHEDULED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('SCHEDULED')}
        >
          Scheduled
        </button>
        <button
          className={`filter-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('COMPLETED')}
        >
          Completed
        </button>
        <button
          className={`filter-btn ${statusFilter === 'CANCELLED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('CANCELLED')}
        >
          Cancelled
        </button>
      </div>

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found for selected filter</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => {
            const appointmentId = appointment.id || appointment.appointmentId;
            const { date, time } = getAppointmentDateTime(appointment);
            const doctorName = appointment.doctorName || appointment?.doctor?.doctorName;
            const patientName = appointment.patientName || appointment?.patient?.name;
            const status = appointment.status || appointment.appointmentStatus;
            return (
              <div 
                key={appointmentId} 
                className="appointment-card"
                onClick={() => handleViewDetails(appointment)}
              >
                <div className="appointment-card-header">
                  <div className="appointment-info">
                    <h3>
                      {user?.role === 'PATIENT' 
                        ? `Dr. ${doctorName || 'N/A'}` 
                        : patientName || 'N/A'}
                    </h3>
                    <p className="appointment-specialty">
                      {appointment.doctorSpecialty || appointment?.doctor?.specialization || appointment.reason}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusClass(status)}`}>
                    {status || 'N/A'}
                  </span>
                </div>
                
                <div className="appointment-card-body">
                  <div className="appointment-detail">
                    <i className="icon-calendar"></i>
                    <span>{date}</span>
                  </div>
                  <div className="appointment-detail">
                    <i className="icon-clock"></i>
                    <span>{time}</span>
                  </div>
                  <div className="appointment-detail">
                    <i className="icon-note"></i>
                    <span>{appointment.reason}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Appointment</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateAppointment}>
              <div className="form-group">
                <label>Select Doctor *</label>
                <select
                  name="doctorId"
                  value={appointmentForm.doctorId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId || doctor.id} value={doctor.doctorId || doctor.id}>
                      Dr. {doctor.doctorName || doctor.name} - {doctor.specialization || doctor.specialty || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={appointmentForm.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={appointmentForm.appointmentTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Visit *</label>
                <input
                  type="text"
                  name="reason"
                  value={appointmentForm.reason}
                  onChange={handleInputChange}
                  placeholder="e.g., Annual checkup, Follow-up consultation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={appointmentForm.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Any additional information for the doctor"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="appointment-details">
              <div className="details-section">
                <h3>Appointment Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>
                      {user?.role === 'PATIENT' ? 'Doctor' : 'Patient'}
                    </label>
                    <p>
                      {user?.role === 'PATIENT' 
                        ? `Dr. ${selectedAppointment.doctorName || selectedAppointment?.doctor?.doctorName || 'N/A'}` 
                        : selectedAppointment.patientName || selectedAppointment?.patient?.name || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <label>Date & Time</label>
                    <p>
                      {getAppointmentDateTime(selectedAppointment).date} at {' '}
                      {getAppointmentDateTime(selectedAppointment).time}
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <label>Status</label>
                    <p>
                      <span className={`status-badge ${getStatusClass(selectedAppointment.status || selectedAppointment.appointmentStatus)}`}>
                        {selectedAppointment.status || selectedAppointment.appointmentStatus}
                      </span>
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <label>Reason</label>
                    <p>{selectedAppointment.reason}</p>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div className="detail-item full-width">
                      <label>Notes</label>
                      <p>{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient's Previous Appointments */}
              <div className="details-section">
                <h3>Previous Appointments</h3>
                <div className="previous-appointments">
                  {appointments
                    .filter(apt => 
                      (apt.id || apt.appointmentId) !== (selectedAppointment.id || selectedAppointment.appointmentId) && 
                      (apt.status || apt.appointmentStatus) === 'COMPLETED' &&
                      (user?.role === 'PATIENT' 
                        ? (apt.patientId || apt?.patient?.patientId) === user.id 
                        : (apt.patientId || apt?.patient?.patientId) === (selectedAppointment.patientId || selectedAppointment?.patient?.patientId))
                    )
                    .slice(0, 5)
                    .map((apt) => {
                      const { date } = getAppointmentDateTime(apt);
                      return (
                        <div key={apt.id || apt.appointmentId} className="previous-appointment-item">
                          <div className="prev-apt-date">{date}</div>
                          <div className="prev-apt-info">
                            <strong>{apt.reason}</strong>
                            {apt.notes && <p>{apt.notes}</p>}
                          </div>
                        </div>
                      );
                    })}
                  {appointments.filter(apt => 
                    (apt.id || apt.appointmentId) !== (selectedAppointment.id || selectedAppointment.appointmentId) && 
                    (apt.status || apt.appointmentStatus) === 'COMPLETED'
                  ).length === 0 && (
                    <p className="no-data">No previous appointments found</p>
                  )}
                </div>
              </div>

              {/* Health Records (Doctor View Only) */}
              {user?.role === 'DOCTOR' && (
                <div className="details-section">
                  <h3>Patient Health Records</h3>
                  <form className="consultation-form" onSubmit={handleConsultationSubmit}>
                    <h4>Add Consultation</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Record Type</label>
                        <input
                          value={consultationForm.recordType}
                          onChange={(e) => setConsultationForm(prev => ({ ...prev, recordType: e.target.value }))}
                          placeholder="CONSULTATION"
                        />
                      </div>
                      <div className="form-group">
                        <label>Diagnosis</label>
                        <input
                          value={consultationForm.diagnosis}
                          onChange={(e) => setConsultationForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Treatment</label>
                      <textarea
                        rows="2"
                        value={consultationForm.treatment}
                        onChange={(e) => setConsultationForm(prev => ({ ...prev, treatment: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Prescription</label>
                        <input
                          value={consultationForm.prescription}
                          onChange={(e) => setConsultationForm(prev => ({ ...prev, prescription: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Doctor Notes</label>
                        <input
                          value={consultationForm.notes}
                          onChange={(e) => setConsultationForm(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn-submit">Save Consultation</button>
                  </form>

                  <div className="health-records">
                    {healthRecords.length > 0 ? (
                      healthRecords.map((record) => (
                        <div key={record.recordId || record.id} className="health-record-item">
                          <div className="record-header">
                            <strong>{record.recordType}</strong>
                            <span className="record-date">
                              {new Date(record.recordDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="record-body">
                            {recordEditId === (record.recordId || record.id) ? (
                              <div className="record-edit-form">
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>Type</label>
                                    <input
                                      value={recordEditForm.recordType}
                                      onChange={(e) => setRecordEditForm(prev => ({ ...prev, recordType: e.target.value }))}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label>Diagnosis</label>
                                    <input
                                      value={recordEditForm.diagnosis}
                                      onChange={(e) => setRecordEditForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Treatment</label>
                                  <textarea
                                    rows="2"
                                    value={recordEditForm.treatment}
                                    onChange={(e) => setRecordEditForm(prev => ({ ...prev, treatment: e.target.value }))}
                                  />
                                </div>
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>Prescription</label>
                                    <input
                                      value={recordEditForm.prescription}
                                      onChange={(e) => setRecordEditForm(prev => ({ ...prev, prescription: e.target.value }))}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label>Notes</label>
                                    <input
                                      value={recordEditForm.notes}
                                      onChange={(e) => setRecordEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                  </div>
                                </div>
                                <div className="record-edit-actions">
                                  <button className="btn-submit" type="button" onClick={handleRecordEditSave}>Save</button>
                                  <button className="btn-close" type="button" onClick={() => setRecordEditId(null)}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                                <p><strong>Treatment:</strong> {record.treatment}</p>
                                {record.prescription && (
                                  <p><strong>Prescription:</strong> {record.prescription}</p>
                                )}
                                {record.notes && (
                                  <p><strong>Notes:</strong> {record.notes}</p>
                                )}
                                <button className="btn-edit-record" type="button" onClick={() => handleRecordEditStart(record)}>
                                  Edit Record
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">No health records found</p>
                    )}
                  </div>
                </div>
              )}

              {user?.role === 'PATIENT' && (
                <div className="details-section">
                  <h3>Doctor Consultation Feedback</h3>
                  {normalizeStatus(selectedAppointment.status || selectedAppointment.appointmentStatus) === 'COMPLETED' ? (
                    <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
                      <div className="form-group">
                        <label>Rating (1-5)</label>
                        <select
                          value={feedbackForm.rating}
                          onChange={(e) => setFeedbackForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Very Poor</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Feedback</label>
                        <textarea
                          rows="3"
                          value={feedbackForm.comment}
                          onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Share your consultation experience"
                        />
                      </div>
                      <button className="btn-submit" type="submit" disabled={feedbackSubmitting}>
                        {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                      {feedbackValue && (
                        <p className="feedback-saved">
                          Saved feedback: {feedbackValue.rating || feedbackForm.rating}/5
                        </p>
                      )}
                    </form>
                  ) : (
                    <p className="no-data">Feedback can be submitted after appointment is completed.</p>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              {isCancellableStatus(selectedAppointment.status || selectedAppointment.appointmentStatus) && (
                <button 
                  className="btn-cancel-appointment"
                  onClick={() => handleCancelAppointment(selectedAppointment.id || selectedAppointment.appointmentId)}
                >
                  Cancel Appointment
                </button>
              )}
              <button 
                className="btn-close"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
