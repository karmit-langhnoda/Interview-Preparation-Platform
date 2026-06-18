import api from './axios';
export const getQuizList = () => api.get('/quiz/list');
export const getQuizBySubject = (subject) => api.get(`/quiz/${subject}`);
export const submitQuiz = (quizId, payload) => api.post(`/quiz/${quizId}/submit`, payload);
export const getMyQuizAttempts = () => api.get('/quiz/my-attempts');
export const getQuizAttemptById = (attemptId) => api.get(`/quiz/attempt/${attemptId}`);