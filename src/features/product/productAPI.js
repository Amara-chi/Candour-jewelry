import axios from 'axios';
import { API_URL } from '../../config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID or slug
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Upload product images to Cloudinary
  uploadImages: async (images) => {
    const formData = new FormData();
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Delete product image
  deleteImage: async (productId, imageId) => {
    const response = await api.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/products', {
      params: { featured: true, limit: 8 },
    });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await api.get(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Bulk operations
  bulkUpdate: async (productIds, updates) => {
    const response = await api.patch('/products/bulk-update', {
      ids: productIds,
      updates,
    });
    return response.data;
  },

  bulkDelete: async (productIds) => {
    const response = await api.post('/products/bulk-delete', {
      ids: productIds,
    });
    return response.data;
  },
};

// Also export the axios instance for direct use if needed
export { api as productAxios };