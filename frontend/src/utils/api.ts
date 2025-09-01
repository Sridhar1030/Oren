import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth tokens and redirect to login
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    // Show error message
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }) => api.post('/api/v1/auth/register', data),
  
  login: (data: { email?: string; username?: string; password: string }) =>
    api.post('/api/v1/auth/login', data),
  
  logout: () => api.get('/api/v1/auth/logout'),
};

// ESG API
export const esgAPI = {
  getMetadata: () => api.get('/api/v1/esg/metadata'),
  
  getResponses: () => api.get('/api/v1/esg/responses'),
  
  getResponseByYear: (year: number) => api.get(`/api/v1/esg/responses/${year}`),
  
  saveResponse: (data: any) => api.post('/api/v1/esg/responses', data),
  
  deleteResponse: (year: number) => api.delete(`/api/v1/esg/responses/${year}`),
  
  getFinancialYears: () => api.get('/api/v1/esg/years'),
  
  getSummary: () => api.get('/api/v1/esg/summary'),
};

// Utility functions
export const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  console.error('API Error:', error);
};

export const handleApiSuccess = (message: string) => {
  toast.success(message);
};

export default api;
