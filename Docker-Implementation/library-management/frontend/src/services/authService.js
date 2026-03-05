import axios from 'axios';

const BASE_URL = '/api/auth';

export const authService = {
  login: (email, password) => axios.post(`${BASE_URL}/login`, { email, password }).then(r => r.data),
};

