import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

export const goalService = {
  createGoal: (userId, data) => api.post(`/goals/user/${userId}`, data),
  getAllGoals: () => api.get('/goals'),
  getGoalById: (id) => api.get(`/goals/${id}`),
  getGoalsByUser: (userId) => api.get(`/goals/user/${userId}`),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};
