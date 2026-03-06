import api, { firstSuccess } from './api';

export const paymentService = {
  getAllPayments: async () =>
    (
      await firstSuccess([
        () => api.get('/api/payments'),
        () => api.get('/payments'),
      ])
    ).data,
  createPayment: async (payment) =>
    (
      await firstSuccess([
        () => api.post('/api/payments', payment),
        () => api.post('/payments', payment),
      ])
    ).data,
  getPaymentsByOrderId: async (orderId) =>
    (
      await firstSuccess([
        () => api.get(`/api/payments/order/${orderId}`),
        () => api.get(`/payments/order/${orderId}`),
      ])
    ).data,
  updatePayment: async (paymentId, payload) =>
    (
      await firstSuccess([
        () => api.put(`/api/payments/${paymentId}`, payload),
        () => api.put(`/payments/${paymentId}`, payload),
      ])
    ).data,
};
