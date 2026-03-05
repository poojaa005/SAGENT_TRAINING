import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

export const incomeService = {
  createIncome: (userId, data) => api.post(`/income/user/${userId}`, data),
  getAllIncome: () => api.get('/income'),
  getIncomeById: (id) => api.get(`/income/${id}`),
  getIncomeByUser: (userId) => api.get(`/income/user/${userId}`),
  updateIncome: (id, data) => api.put(`/income/${id}`, data),
  deleteIncome: (id) => api.delete(`/income/${id}`),
};

