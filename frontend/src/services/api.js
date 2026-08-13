import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('tenantToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('tenantToken');
      localStorage.removeItem('userRole');
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');

// --- Property Endpoints ---
export const getProperties = () => api.get('/properties');
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// --- Unit Endpoints ---
export const getUnits = (propertyId) => api.get('/units', { params: { propertyId } });
export const createUnit = (data) => api.post('/units', data);
export const updateUnit = (id, data) => api.put(`/units/${id}`, data);

// --- Tenant Endpoints ---
export const getTenants = () => api.get('/tenants');
export const getTenantById = (id) => api.get(`/tenants/${id}`);
export const createTenant = (data) => api.post('/tenants', data);
export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => api.delete(`/tenants/${id}`);

// --- Lease Endpoints ---
export const getLeases = () => api.get('/leases');
export const createLease = (data) => api.post('/leases', data);
export const updateLeaseStatus = (id, status) => api.put(`/leases/${id}/status`, { status });

// --- Payment & M-Pesa Endpoints ---
export const getPayments = () => api.get('/payments');
export const createPayment = (data) => api.post('/payments', data);
export const initiateMpesaPayment = (paymentData) => api.post('/payments/mpesa/stkpush', paymentData);

// --- Expense Endpoints ---
export const getExpenses = () => api.get('/expenses');
export const createExpense = (data) => api.post('/expenses', data);

// --- Maintenance Endpoints ---
export const getMaintenanceRequests = () => api.get('/maintenance');
export const createMaintenanceRequest = (data) => api.post('/maintenance', data);
export const updateMaintenanceStatus = (id, data) => api.put(`/maintenance/${id}`, data);

// --- Notification Endpoints ---
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);

// --- Dashboard & Analytics Endpoints ---
export const getAnalyticsStats = () => api.get('/analytics/stats');
export const getPublicStatistics = () => api.get('/public/statistics');

// --- File Upload Endpoints ---
export const uploadSingleFile = (formData, folder = 'properties') =>
  api.post(`/upload/single?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const uploadMultipleFiles = (formData, folder = 'properties') =>
  api.post(`/upload/multiple?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getUploadedFiles = (folder = 'properties') =>
  api.get(`/upload/files`, { params: { folder } });

export default api;
