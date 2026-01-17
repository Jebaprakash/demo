import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getCategories: () => api.get('/products/categories'),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getById: (id) => api.get(`/orders/${id}`),
    updatePaymentStatus: (orderId, paymentStatus) =>
        api.patch(`/orders/${orderId}/payment-status`, { paymentStatus }),
};

// Admin API
export const adminAPI = {
    login: (credentials) => api.post('/admin/login', credentials),

    // Products
    getAllProducts: () => api.get('/admin/products'),
    createProduct: (formData) => api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),

    // Orders
    getAllOrders: (params) => api.get('/admin/orders', { params }),
    updateOrder: (id, data) => api.patch(`/admin/orders/${id}`, data),
};

export default api;
