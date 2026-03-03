import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/payment';

export const paymentService = {
  getAll: () => axios.get(BASE_URL).then(r => r.data),
  getById: (id) => axios.get(`${BASE_URL}/${id}`).then(r => r.data),
  deleteById: (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data),
  payFine: (fineId, method = 'UPI') => axios.post(
    `${BASE_URL}/pay/${fineId}`,
    null,
    { params: { method } }
  ).then(r => r.data),
};
