import axios from 'axios';
import { API_URL } from '../../config/api';

const cartAPI = {
  // Get user cart
  getCart: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/cart`,
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/cart/${itemId}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/cart/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default cartAPI;
