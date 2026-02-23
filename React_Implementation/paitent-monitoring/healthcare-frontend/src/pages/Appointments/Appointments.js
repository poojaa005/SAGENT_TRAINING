import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import healthRecordService from '../../services/healthRecordService';
import './Appointments.css';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setError('Failed to cancel appointment');
      }
    }
  };

  const handleViewDetails = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
    
    // Fetch health records if doctor is viewing
    if (user?.role === 'DOCTOR') {
      const patientId = appointment.patientId || appointment?.patient?.patientId;
      if (patientId) {
        await fetchHealthRecords(patientId);
      } else {
        setHealthRecords([]);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SCHEDULED':
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
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Scheduled</button>
        <button className="filter-btn">Completed</button>
        <button className="filter-btn">Cancelled</button>
      </div>

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found</p>
          </div>
        ) : (
          appointments.map((appointment) => {
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
                  <div className="health-records">
                    {healthRecords.length > 0 ? (
                      healthRecords.map((record) => (
                        <div key={record.id} className="health-record-item">
                          <div className="record-header">
                            <strong>{record.recordType}</strong>
                            <span className="record-date">
                              {new Date(record.recordDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="record-body">
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            <p><strong>Treatment:</strong> {record.treatment}</p>
                            {record.prescription && (
                              <p><strong>Prescription:</strong> {record.prescription}</p>
                            )}
                            {record.notes && (
                              <p><strong>Notes:</strong> {record.notes}</p>
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
            </div>

            <div className="modal-actions">
              {(selectedAppointment.status || selectedAppointment.appointmentStatus) === 'SCHEDULED' && (
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
