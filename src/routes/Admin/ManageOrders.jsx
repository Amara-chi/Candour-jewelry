import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import axios from 'axios';
import { API_URL } from '../../config/api';
import Spinner from '../../components/Spinner';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await axios.get(
        `${API_URL}/orders/admin/all${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  return (
    <>
      <SEOHead
        title="Manage Orders - Admin"
        description="Manage customer orders"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8">
          Order Management
        </h1>

        <div className="mb-6 flex gap-2">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-dark-700 text-dark-700 dark:text-white hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner className="py-8" size={52} />
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-dark-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                      <td className="px-6 py-4 text-sm text-dark-900 dark:text-white font-mono">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300">
                        {order.user?.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-dark-900 dark:text-white">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded text-sm font-medium text-white ${
                            order.status === 'delivered'
                              ? 'bg-green-500'
                              : order.status === 'cancelled'
                              ? 'bg-red-500'
                              : 'bg-primary-500'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageOrders;
