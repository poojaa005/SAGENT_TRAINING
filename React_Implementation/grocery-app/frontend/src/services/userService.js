import api, { firstSuccess } from './api';

export const userService = {
  createUser: async (user) => (await firstSuccess([
    () => api.post('/api/users', user),
    () => api.post('/users', user),
  ])).data,
  getAllUsers: async () => (await firstSuccess([
    () => api.get('/api/users'),
    () => api.get('/users'),
  ])).data,
  getUserById: async (id) => (await firstSuccess([
    () => api.get(`/api/users/${id}`),
    () => api.get(`/users/${id}`),
  ])).data,
  updateUser: async (id, user) => (await firstSuccess([
    () => api.put(`/api/users/${id}`, user),
    () => api.put(`/users/${id}`, user),
  ])).data,
  deleteUser: async (id) => (await firstSuccess([
    () => api.delete(`/api/users/${id}`),
    () => api.delete(`/users/${id}`),
  ])).data,
  searchByEmail: async (email) => {
    const encoded = encodeURIComponent(email);
    return (await firstSuccess([
      () => api.get(`/api/users/search/email/${encoded}`),
      () => api.get(`/api/users/search?email=${encoded}`),
      () => api.get(`/users/search/email/${encoded}`),
    ])).data;
  },
  searchByName: async (name) => {
    const encoded = encodeURIComponent(name);
    return (await firstSuccess([
      () => api.get(`/api/users/search/name/${encoded}`),
      () => api.get(`/api/users/search?name=${encoded}`),
      () => api.get(`/users/search/name/${encoded}`),
    ])).data;
  },
};
