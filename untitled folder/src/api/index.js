// src/api/index.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage on each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// 📦 User Services
// -----------------------------
export const userService = {
  createUser: (data) => api.post('/auth/users', data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  getAllUsers: () => api.get('/admin/users'), // Keep if route is defined
};

// -----------------------------
// 🏗️ Progress Services
// -----------------------------
export const progressService = {
  getAllProgress: () => api.get('/progress'),
  getProgressByDate: (date) => api.get(`/progress?date=${date}`),
  getPendingProgress: () => api.get('/progress?approved=false'),
  approveProgress: (id) => api.put(`/progress/${id}/approve`),
};

// -----------------------------
// 💰 Payment Services
// -----------------------------
export const paymentService = {
  getAllPayments: () => api.get('/payments'),
  getPaymentsByDate: (date) => api.get(`/payments?date=${date}`),
  getPendingPayments: () => api.get('/payments?approved=false'),
  approvePayment: (id) => api.put(`/payments/${id}/approve`),
};

export default api;
