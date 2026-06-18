import api from './axios';

export const getTodayDsa = () => api.get('/dsa/today');
export const getTodayDsaByDifficulty = (difficulty) => api.get(`/dsa/today/${difficulty}`);
export const markDsaSolved = (difficulty) => api.post('/dsa/solve', { difficulty });
export const getDsaProgress = () => api.get('/dsa/progress');

export const getDsaProblem = getTodayDsaByDifficulty;
export const solveDsaProblem = (difficulty) => markDsaSolved(difficulty);