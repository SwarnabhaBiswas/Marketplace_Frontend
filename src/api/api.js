import axios from 'axios';
import { beginNetwork, endNetwork } from '../lib/loading';

const isProd = import.meta.env.PROD;

const envBase = import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim();
const baseURL = envBase ? envBase.replace(/\/$/, '') : (isProd ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000
});

if (import.meta.env.DEV) {
  // Helpful during local debugging to confirm which API base URL is used
  // eslint-disable-next-line no-console
  console.log('[api] baseURL:', baseURL);
}

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

export const deleteDealer = (id) =>
  api.delete(`/dealers/${id}`);

export default api;
