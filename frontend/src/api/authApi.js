import api from './axios';

export const loginApi = (payload) => api.post('/api/auth/login', payload);
export const registerApi = (payload) => api.post('/api/auth/signup', payload);
export const logoutApi = () => api.post('/api/auth/logout');
export const adminLogoutApi = () => api.post('/api/auth/admin/logout');
export const meApi = () => api.get('/api/auth/me');