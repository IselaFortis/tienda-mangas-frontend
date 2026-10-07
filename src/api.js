import axios from 'axios';

// En Vercel usa VITE_API_URL; en desarrollo usa localhost
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});
