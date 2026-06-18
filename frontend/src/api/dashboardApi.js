import api from './axios';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardRecent = (limit = 10) => api.get('/dashboard/recent', { params: { limit } });
export const getStreakCalendar = (year, month) =>
  api.get(`/streak/calendar?year=${year}&month=${month}`);