import api from './axios';

export const getProfileSummary = () => api.get('/profile/summary');