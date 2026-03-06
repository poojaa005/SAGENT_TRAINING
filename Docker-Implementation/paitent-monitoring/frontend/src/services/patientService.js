// src/services/patientService.js
import { api } from "./api";

// Get patient appointments
export const getAppointments = async (patientId) => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return response.data;
};

// Get patient health records
export const getPatientRecords = async (patientId) => {
  const response = await api.get(`/health-records/patient/${patientId}`);
  return response.data;
};

// Get patient profile
export const getPatientProfile = async (patientId) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

// Update patient profile
export const updatePatientProfile = async (patientId, data) => {
  const response = await api.put(`/patients/${patientId}`, data);
  return response.data;
};
