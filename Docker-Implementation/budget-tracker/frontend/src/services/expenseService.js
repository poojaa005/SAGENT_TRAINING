import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

export const expenseService = {
  createExpense: (data) => api.post('/expenses', data),
  getAllExpenses: () => api.get('/expenses'),
  getExpenseById: (id) => api.get(`/expenses/${id}`),
  getExpensesByUser: (userId) => api.get(`/expenses/user/${userId}`),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};
