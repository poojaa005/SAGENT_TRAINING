import api, { firstSuccess } from './api';

export const cartService = {
  createCart: async (cart) => (await firstSuccess([
    () => api.post('/carts', cart),
    () => api.post('/api/carts', cart),
  ])).data,
  getAllCarts: async () => (await firstSuccess([
    () => api.get('/carts'),
    () => api.get('/api/carts'),
  ])).data,
  getCartById: async (id) => (await firstSuccess([
    () => api.get(`/carts/${id}`),
    () => api.get(`/api/carts/${id}`),
  ])).data,
  getCartByUserId: async (userId) => (await firstSuccess([
    () => api.get(`/carts/user/${userId}`),
    () => api.get(`/api/carts/user/${userId}`),
    () => api.get(`/api/carts/user-id/${userId}`),
  ])).data,
  updateCart: async (id, cart) => (await firstSuccess([
    () => api.put(`/carts/${id}`, cart),
    () => api.put(`/api/carts/${id}`, cart),
  ])).data,
  deleteCart: async (id) => (await firstSuccess([
    () => api.delete(`/carts/${id}`),
    () => api.delete(`/api/carts/${id}`),
  ])).data,
};
