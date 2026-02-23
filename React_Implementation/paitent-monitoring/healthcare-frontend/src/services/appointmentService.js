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
  const response = await api.delete(`/appointments/${appointmentId}`);
  return response.data;
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

// Compatibility default export for pages using object-style service calls.
const appointmentService = {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getPatientAppointments,
  getDoctorAppointments,
  getAllDoctors,
};

export default appointmentService;
