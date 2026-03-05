import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8080';

const api = axios.create({ baseURL: BASE_URL });

// Students
export const registerStudent = (data) => api.post('/students', data);
export const getStudent = (id) => api.get(`/students/${id}`);
export const getAllStudents = () => api.get('/students');
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);

// Personal Details
export const savePersonalDetails = (data) => api.post('/personal-details', data);
export const getPersonalDetails = (id) => api.get(`/personal-details/${id}`);

// Courses
export const getCourses = () => api.get('/courses');
export const createCourse = (data) => api.post('/courses', data);

// Applications
export const createApplication = (data) => api.post('/applications', data);
export const getApplications = () => api.get('/applications');
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

// Academic Details
export const saveAcademicDetails = (data) => api.post('/academic-details', data);
export const getAcademicDetails = (appId) => api.get(`/academic-details/${appId}`);

// Documents
export const uploadDocument = (data) => api.post('/documents', data);
export const getDocuments = () => api.get('/documents');

// Payments
export const makePayment = (data) => api.post('/payments', data);
export const getPayment = (id) => api.get(`/payments/${id}`);

// Officers
export const getOfficers = () => api.get('/officers');
export const getOfficerById = (id) => api.get(`/officers/${id}`);

// Reviews
export const getReviews = () => api.get('/reviews');
export const createReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);

export default api;
