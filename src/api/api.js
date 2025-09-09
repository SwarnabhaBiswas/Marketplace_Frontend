import axios from 'axios';
import { beginNetwork, endNetwork } from '../lib/loading';

const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
  withCredentials: true,
  timeout: 15000
});

// Interceptors to toggle global spinner
api.interceptors.request.use((config) => {
  if (!config?.noSpinner) beginNetwork();
  return config;
});
api.interceptors.response.use(
  (resp) => { if (!resp?.config?.noSpinner) endNetwork(); return resp; },
  (err) => { if (!err?.config?.noSpinner) endNetwork(); return Promise.reject(err); }
);

export const updateDealerStatus = (id, status) =>
  api.put(`/dealers/${id}/status`, { status });

export default api;
