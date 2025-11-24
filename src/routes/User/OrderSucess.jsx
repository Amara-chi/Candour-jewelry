import React, { useEffect, useState } from 'react';
import { useSearch, Link } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { SEOHead } from '../../components/SEOHead';
import axios from 'axios';
import { API_URL } from '../../config/api';

const OrderSuccess = () => {
  const { orderId } = useSearch({ from: '/order-success' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(response.data.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEOHead 
        title="Order Confirmed - Candour Jewelry"
        description="Your order has been successfully placed"
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-elegant font-bold text-green-600 dark:text-green-400 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-dark-600 dark:text-dark-300 mb-6">
            Thank you for your order. A confirmation email has been sent to your inbox.
          </p>

          {order && (
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6 text-left mb-6">
              <p className="text-sm text-dark-600 dark:text-dark-300 mb-2">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="text-sm text-dark-600 dark:text-dark-300 mb-2">
                <strong>Status:</strong> <span className="capitalize text-blue-600">{order.status}</span>
              </p>
              <p className="text-sm text-dark-600 dark:text-dark-300 mb-2">
                <strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}
              </p>
              <p className="text-sm text-dark-600 dark:text-dark-300">
                <strong>Items:</strong> {order.items?.length} product(s)
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccess;
