import axios from 'axios';

const BASE_URL = '/members';

export const memberService = {
  getAll: () => axios.get(BASE_URL).then(r => r.data),
  getById: (id) => axios.get(`${BASE_URL}/${id}`).then(r => r.data),
  create: (member) => axios.post(BASE_URL, member).then(r => r.data),
  update: (id, member) => axios.put(`${BASE_URL}/${id}`, member).then(r => r.data),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`).then(r => r.data),
  searchByName: (name) => axios.get(`${BASE_URL}/search/name?name=${name}`).then(r => r.data),
  searchByEmail: (email) => axios.get(`${BASE_URL}/search/email?email=${email}`).then(r => r.data),
};
