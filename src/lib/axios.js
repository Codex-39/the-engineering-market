import axios from 'axios';

const api = axios.create({
  baseURL: 'https://the-engineering-market.onrender.com/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('em_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('em_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;