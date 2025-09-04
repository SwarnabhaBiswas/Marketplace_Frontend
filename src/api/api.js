import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});
export const updateDealerStatus = (id, status) =>
  api.put(`/dealers/${id}/status`, { status });

export default api;
