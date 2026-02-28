import api, { firstSuccess } from './api';

export const storeService = {
  getAllStores: async () => (await firstSuccess([
    () => api.get('/api/stores'),
    () => api.get('/stores'),
  ])).data,
  getStoreById: async (id) => (await firstSuccess([
    () => api.get(`/api/stores/${id}`),
    () => api.get(`/stores/${id}`),
  ])).data,
  createStore: async (store) => (await firstSuccess([
    () => api.post('/api/stores', store),
    () => api.post('/stores', store),
  ])).data,
  updateStore: async (id, store) => (await firstSuccess([
    () => api.put(`/api/stores/${id}`, store),
    () => api.put(`/stores/${id}`, store),
  ])).data,
  deleteStore: async (id) => (await firstSuccess([
    () => api.delete(`/api/stores/${id}`),
    () => api.delete(`/stores/${id}`),
  ])).data,
};
