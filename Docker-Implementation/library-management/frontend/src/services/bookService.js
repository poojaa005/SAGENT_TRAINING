import axios from 'axios';

const BASE_URL = '/api/books';

export const bookService = {
  getAll: () => axios.get(BASE_URL).then(r => r.data),
  getById: (id) => axios.get(`${BASE_URL}/${id}`).then(r => r.data),
  create: (book) => axios.post(BASE_URL, book).then(r => r.data),
  update: (id, book) => axios.put(`${BASE_URL}/${id}`, book).then(r => r.data),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data),
};
