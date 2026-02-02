import React, { useState, useEffect } from 'react'
import { SEOHead } from '../../components/SEOHead'
import { useSelector } from 'react-redux'
import { getUsers } from '../../features/user/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { Link } from '@tanstack/react-router'
import Spinner from '../../components/Spinner'


const Dashboard = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user || state.users)
  const users = userState?.items || []
  const loading = userState?.loading || false
  const regularUsers = users.filter(user => user.role === 'user')
  const adminUsers = users.filter(user => user.role === 'admin')

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    dispatch(getUsers())
    fetchProducts()
    fetchOrders()
  }, [dispatch])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      setProducts(response.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_URL}/orders/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(response.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  const stats = [
    { label: 'Total Products', value: products.length, color: 'primary' },
    { label: 'Orders Today', value: todayOrders.length, color: 'wine' },
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'green' },
    { label: 'Customers', value: regularUsers.length, color: 'blue' },
    { label: 'Total Orders', value: orders.length, color: 'purple' },
  ]

  return (
    <>
      <SEOHead title="Admin Dashboard" description="Manage your Candour Jewelry e-commerce store, products, orders, and customers." />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-elegant font-bold text-dark-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-dark-600 dark:text-dark-300">Welcome back! Here's your store overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-700 rounded-xl p-6 shadow-md border border-gray-200 dark:border-dark-700">
              <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/products">
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors">
                Manage Products
              </button>
            </Link>
            <Link to="/admin/orders">
              <button className="w-full bg-wine-500 hover:bg-wine-600 text-white py-3 rounded-lg font-semibold transition-colors">
                View Orders
              </button>
            </Link>
            <Link to="/admin/categories">
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors">
                Manage Categories
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
              Recent Orders
            </h2>
            <Link to="/admin/orders">
              <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
                View All →
              </button>
            </Link>
          </div>

          {ordersLoading ? (
            <Spinner className="py-8" size={36} />
          ) : orders.length === 0 ? (
            <p className="text-dark-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-dark-700">
                  <tr>
                    <th className="text-left py-3 text-dark-700 dark:text-dark-300 font-semibold">Order ID</th>
                    <th className="text-left py-3 text-dark-700 dark:text-dark-300 font-semibold">Customer</th>
                    <th className="text-left py-3 text-dark-700 dark:text-dark-300 font-semibold">Total</th>
                    <th className="text-left py-3 text-dark-700 dark:text-dark-300 font-semibold">Status</th>
                    <th className="text-left py-3 text-dark-700 dark:text-dark-300 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 dark:border-dark-700">
                      <td className="py-3 text-dark-900 dark:text-white font-mono">{order._id.slice(-6)}</td>
                      <td className="py-3 text-dark-600 dark:text-dark-300">{order.user?.name || 'Guest'}</td>
                      <td className="py-3 text-dark-900 dark:text-white font-semibold">${order.totalAmount?.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-dark-600 dark:text-dark-300 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
