import axios from 'axios';

// Axios instance: in dev use localhost:3001, in prod use VITE_API_URL
const envUrl = import.meta.env.VITE_API_URL;
const baseURL = envUrl || 'http://localhost:3001/api';
const api = axios.create({ baseURL });

// Attach JWT token on every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Products ─────────────────────────────────────────
export const getProducts = (params = {}) => api.get('/products', { params });
export const getAdminProducts = (params = {}) => api.get('/products/admin', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadProductImages = (id, formData) =>
    api.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProductImage = (id, filename) => api.delete(`/products/${id}/images/${filename}`);

// ── Categories ────────────────────────────────────────
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ── Auth ─────────────────────────────────────────────
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');

// ── Settings ─────────────────────────────────────────
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;
