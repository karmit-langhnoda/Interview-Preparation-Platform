import api from './axios';

export const createNote = (payload) => api.post('/notes', payload);
export const getNotes = (params) => api.get('/notes', { params });
export const updateNote = (id, payload) => api.put(`/notes/${id}`, payload);
export const deleteNote = (id) => api.delete(`/notes/${id}`);