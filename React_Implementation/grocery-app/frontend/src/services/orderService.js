import api, { firstSuccess } from './api';

export const orderService = {
  createOrder: async (order) => (await firstSuccess([
    () => api.post('/api/orders', order),
    () => api.post('/orders', order),
  ])).data,
  getAllOrders: async () => (await firstSuccess([
    () => api.get('/api/orders'),
    () => api.get('/orders'),
  ])).data,
  getOrderById: async (id) => (await firstSuccess([
    () => api.get(`/api/orders/${id}`),
    () => api.get(`/orders/${id}`),
  ])).data,
  getOrdersByUserId: async (userId) => (await firstSuccess([
    () => api.get(`/api/orders/user/${userId}`),
    () => api.get(`/api/orders/user-id/${userId}`),
    () => api.get(`/orders/user/${userId}`),
  ])).data,
  updateOrder: async (id, order) => (await firstSuccess([
    () => api.put(`/api/orders/${id}`, order),
    () => api.put(`/orders/${id}`, order),
  ])).data,
  deleteOrder: async (id) => (await firstSuccess([
    () => api.delete(`/api/orders/${id}`),
    () => api.delete(`/orders/${id}`),
  ])).data,
};
