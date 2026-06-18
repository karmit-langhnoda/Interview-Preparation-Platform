import api from './axios';

export const generateQuiz = (payload) => api.post('/admin/quiz/generate', payload);
export const regenerateDsa = () => api.post('/admin/dsa/generate');