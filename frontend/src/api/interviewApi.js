import api from './axios';

export const startInterview = (payload) => api.post('/interview/start', payload);
export const sendInterviewMessage = (sessionId, payload) =>
  api.post(`/interview/${sessionId}/message`, payload);
export const endInterview = (sessionId) => api.post(`/interview/${sessionId}/end`);
export const clearInterviewOnLogout = () => api.delete('/interview/logout-clear');