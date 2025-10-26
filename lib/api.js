import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  
  // Helper functions
  saveAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// ============================================
// USER API
// ============================================
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  addPaymentMethod: (data) => api.post('/users/payment-methods', data),
  getPaymentMethods: () => api.get('/users/payment-methods'),
  
  addRecipient: (data) => api.post('/users/recipients', data),
  getRecipients: () => api.get('/users/recipients'),
};

// ============================================
// TRANSACTION API
// ============================================
export const transactionAPI = {
  compareRoutes: (data) => api.post('/transactions/compare-routes', data),
  createTransaction: (data) => api.post('/transactions/create', data),
  getStatus: (id) => api.get(`/transactions/${id}/status`),
  getHistory: (params) => api.get('/transactions/history', { params }),
  getStats: () => api.get('/transactions/stats'),
};

// ============================================
// RATES API
// ============================================
export const ratesAPI = {
  getRate: (from, to) => api.get(`/rates/${from}/${to}`),
  calculate: (data) => api.post('/rates/calculate', data),
  getSupportedCurrencies: () => api.get('/rates/currencies/supported'),
};

export default api;