import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add JWT token to headers if it exists in localStorage
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
    getAllUsers: () => api.get('/auth/users'),
    toggleUserStatus: (id) => api.put(`/auth/users/${id}/status`),
    adminUserUpdate: (id, userData) => api.put(`/auth/users/${id}`, userData),
    getUserByUsername: (username) => api.get(`/auth/user/${username}`),
    rateSeller: (username, rating) => api.post(`/auth/rate/${username}`, { rating }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

export const productAPI = {
    getProducts: (params) => api.get('/products', { params }),
    getProduct: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    toggleCart: (id) => api.put(`/products/${id}/cart`),
    checkout: (productIds) => api.post('/products/checkout', { productIds }),
};

export const orderAPI = {
    placeOrder: (orderData) => api.post('/orders', orderData),
    getSellerOrders: () => api.get('/orders/seller'),
    getBuyerOrders: () => api.get('/orders/buyer'),
    verifyOrder: (id) => api.put(`/orders/${id}/verify`),
};

export default api;
