import axios from 'axios';

const BASE_URL = '/api/borrow';

export const borrowService = {
  getAll: () => axios.get(BASE_URL).then(r => r.data),
  createRequest: (memberId, bookId) => axios.post(`${BASE_URL}/${memberId}/${bookId}`).then(r => r.data),
  updateStatus: (requestId, status) => axios.put(`${BASE_URL}/${requestId}/${status}`).then(r => r.data),
  deleteRequest: (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data),
};
