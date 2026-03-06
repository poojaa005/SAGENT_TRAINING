// src/services/appointmentService.js
import { api } from "./api";

// Book new appointment
export const bookAppointment = async ({ doctorId, patientId, appointmentData }) => {
  const response = await api.post(
    `/appointments/${doctorId}/${patientId}`,
    appointmentData
  );
  return response.data;
};

// Cancel appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    // Preferred backend flow: status update instead of hard delete.
    const response = await api.patch(`/appointments/${appointmentId}/cancel`);
    return response.data;
  } catch (err) {
    // Compatibility fallback when PATCH endpoint is not active on backend.
    if (err.response && [404, 405].includes(err.response.status)) {
      const currentResponse = await api.get(`/appointments/${appointmentId}`);
      const current = currentResponse.data || {};

      const payload = {
        appointmentDate: current.appointmentDate || null,
        appointmentTime: current.appointmentTime || null,
        appointmentStatus: "Cancelled",
      };

      const updateResponse = await api.put(`/appointments/${appointmentId}`, payload);
      return updateResponse.data;
    }

    // Last fallback for legacy hard-delete backends.
    if (err.response && err.response.status >= 500) {
      const response = await api.delete(`/appointments/${appointmentId}`);
      return response.data;
    }

    throw err;
  }
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data;
};

// Get patient appointments
export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return response.data;
};

// Get doctor appointments
export const getDoctorAppointments = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

// Get all doctors
export const getAllDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

const FEEDBACK_STORAGE_KEY_PREFIX = "appointment_feedback_";

const persistFeedbackLocal = (appointmentId, payload) => {
  const key = `${FEEDBACK_STORAGE_KEY_PREFIX}${appointmentId}`;
  const record = {
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(record));
  return record;
};

const readFeedbackLocal = (appointmentId) => {
  const key = `${FEEDBACK_STORAGE_KEY_PREFIX}${appointmentId}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const submitAppointmentFeedback = async (appointmentId, payload) => {
  const endpoints = [
    `/appointments/${appointmentId}/feedback`,
    `/feedback/appointments/${appointmentId}`,
    `/appointments/feedback/${appointmentId}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (err) {
      if (!err.response || err.response.status !== 404) throw err;
    }
  }

  return persistFeedbackLocal(appointmentId, payload);
};

export const getAppointmentFeedback = async (appointmentId) => {
  const endpoints = [
    `/appointments/${appointmentId}/feedback`,
    `/feedback/appointments/${appointmentId}`,
    `/appointments/feedback/${appointmentId}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (err) {
      if (!err.response || err.response.status !== 404) throw err;
    }
  }

  return readFeedbackLocal(appointmentId);
};

// Compatibility default export for pages using object-style service calls.
const appointmentService = {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getPatientAppointments,
  getDoctorAppointments,
  getAllDoctors,
  submitAppointmentFeedback,
  getAppointmentFeedback,
};

export default appointmentService;
