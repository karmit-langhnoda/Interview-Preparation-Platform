import axios from 'axios';

const getBaseURL = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  return rawUrl.trim().replace(/\/api\/?$/, '').replace(/\/$/, '');
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    // Ensure all requests are prefixed with /api
    if (config.url && !config.url.startsWith('/api/') && !config.url.startsWith('http')) {
      config.url = `/api/${config.url.replace(/^\//, '')}`;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
