import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

export const budgetService = {
  createBudget: (userId, data) => api.post(`/budgets/user/${userId}`, data),
  getAllBudgets: () => api.get('/budgets'),
  getBudgetById: (id) => api.get(`/budgets/${id}`),
  getBudgetsByUser: (userId) => api.get(`/budgets/user/${userId}`),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
};
