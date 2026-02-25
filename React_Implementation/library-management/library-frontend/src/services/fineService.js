import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/fine';

export const fineService = {
  getAll: () => axios.get(BASE_URL).then(r => r.data),
  calculateFine: (requestId, returnDate) => axios.post(`${BASE_URL}/${requestId}/${returnDate}`).then(r => r.data),
  deleteFine: (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data),
};
