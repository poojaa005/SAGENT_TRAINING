import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/notifications';

async function requestWithFallback(requests) {
  let lastError;
  for (const request of requests) {
    try {
      const response = await request();
      return response.data;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export const notificationService = {
  getByMember: (memberId) => axios.get(`${BASE_URL}/${memberId}`).then(r => r.data),
  create: (memberId, message) => axios.post(`${BASE_URL}/${memberId}`, message, {
    headers: { 'Content-Type': 'application/json' }
  }).then(r => r.data),
  markAsRead: (id) => requestWithFallback([
    () => axios.put(`${BASE_URL}/read/${id}`, {}),
    () => axios.put(`${BASE_URL}/${id}/read`, {}),
    () => axios.patch(`${BASE_URL}/read/${id}`),
    () => axios.patch(`${BASE_URL}/${id}/read`),
  ]),
  delete: (id) => requestWithFallback([
    () => axios.delete(`${BASE_URL}/${id}`),
    () => axios.delete(`${BASE_URL}/delete/${id}`),
  ]),
};
