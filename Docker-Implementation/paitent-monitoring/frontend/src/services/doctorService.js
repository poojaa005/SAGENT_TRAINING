// src/services/doctorService.js
import { api } from "./api";

// Get patients linked to doctor via patient history
export const getDoctorPatients = async (doctorId) => {
  const response = await api.get(`/patient-history/doctor/${doctorId}`);
  const historyRows = Array.isArray(response.data) ? response.data : [];

  const uniquePatients = new Map();
  historyRows.forEach((row) => {
    if (row && row.patient && row.patient.patientId != null) {
      uniquePatients.set(row.patient.patientId, row.patient);
    }
  });

  return Array.from(uniquePatients.values());
};

// Get doctor appointments
export const getDoctorAppointments = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

// Get doctor profile
export const getDoctorProfile = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

// Update doctor profile
export const updateDoctorProfile = async (doctorId, data) => {
  const response = await api.put(`/doctors/${doctorId}`, data);
  return response.data;
};
