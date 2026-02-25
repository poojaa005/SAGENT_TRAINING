import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

export const authService = {
  login: (email, password) => axios.post(`${BASE_URL}/login`, { email, password }).then(r => r.data),
};

