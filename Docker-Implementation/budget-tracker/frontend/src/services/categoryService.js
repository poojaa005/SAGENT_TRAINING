import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
};
