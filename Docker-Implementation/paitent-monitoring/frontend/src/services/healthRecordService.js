// src/services/healthRecordService.js
import { api } from "./api";

// Add new health record
export const addHealthRecord = async (patientId, recordData) => {
  const response = await api.post(`/health-records/${patientId}`, recordData);
  return response.data;
};

// Get health records by patient ID
export const getHealthRecordsByPatient = async (patientId) => {
  const response = await api.get(`/health-records/patient/${patientId}`);
  return response.data;
};

// Compatibility alias used by Appointments page.
export const getPatientHealthRecords = getHealthRecordsByPatient;

// Update health record
export const updateHealthRecord = async (recordId, data) => {
  const response = await api.put(`/health-records/${recordId}`, data);
  return response.data;
};

const healthRecordService = {
  addHealthRecord,
  getHealthRecordsByPatient,
  getPatientHealthRecords,
  updateHealthRecord,
};

export default healthRecordService;
