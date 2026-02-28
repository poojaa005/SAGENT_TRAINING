import api, { firstSuccess } from './api';

export const orderItemService = {
  createOrderItem: async (item) =>
    (
      await firstSuccess([
        () => api.post('/api/order-items', item),
        () => api.post('/order-items', item),
      ])
    ).data,
  getItemsByOrderId: async (orderId) =>
    (
      await firstSuccess([
        () => api.get(`/api/order-items/order/${orderId}`),
        () => api.get(`/order-items/order/${orderId}`),
      ])
    ).data,
};
