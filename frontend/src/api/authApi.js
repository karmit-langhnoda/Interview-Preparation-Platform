import api from './axios';

export const loginApi = (payload) => api.post('/auth/login', payload);
export const registerApi = (payload) => api.post('/auth/signup', payload);
export const logoutApi = () => api.post('/auth/logout');
export const adminLogoutApi = () => api.post('/auth/admin/logout');
export const meApi = () => api.get('/auth/me');