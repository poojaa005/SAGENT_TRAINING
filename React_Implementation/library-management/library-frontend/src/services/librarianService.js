import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/librarians';

export const librarianService = {
  getAll: () => axios.get(BASE_URL).then(r => r.data),
  getById: (id) => axios.get(`${BASE_URL}/${id}`).then(r => r.data),
  create: (librarian) => axios.post(BASE_URL, librarian).then(r => r.data),
  update: (id, librarian) => axios.put(`${BASE_URL}/${id}`, librarian).then(r => r.data),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data),
};
