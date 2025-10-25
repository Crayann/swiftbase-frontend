// lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionAPI = {
  compareRoutes: async (amount, fromCurrency, toCurrency) => {
    const response = await api.post('/transactions/compare-routes', {
      amount,
      fromCurrency,
      toCurrency,
    });
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions/create', transactionData);
    return response.data;
  },

  getTransactionStatus: async (id) => {
    const response = await api.get(`/transactions/${id}/status`);
    return response.data;
  },

  getTransactionHistory: async (userId) => {
    const response = await api.get(`/transactions/user/${userId}/history`);
    return response.data;
  },
};

export default api;