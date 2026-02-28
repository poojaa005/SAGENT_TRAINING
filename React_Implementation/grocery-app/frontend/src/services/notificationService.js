import api, { firstSuccess } from './api';

export const notificationService = {
  createNotification: async (notification) =>
    (
      await firstSuccess([
        () => api.post('/api/notifications', notification),
        () => api.post('/notifications', notification),
      ])
    ).data,
  getByUserId: async (userId) =>
    (
      await firstSuccess([
        () => api.get(`/api/notifications/user/${userId}`),
        () => api.get(`/notifications/user/${userId}`),
      ])
    ).data,
};
