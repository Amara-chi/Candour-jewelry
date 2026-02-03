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
  const [revenueRange, setRevenueRange] = useState('30d')

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

  const deliveredOrders = orders.filter(order => order.status === 'delivered').length
  const fulfillmentRate = orders.length ? Math.round((deliveredOrders / orders.length) * 100) : 0

  const rangeOptions = [
    { value: '7d', label: 'Last 7 days', days: 7 },
    { value: '30d', label: 'Last 30 days', days: 30 },
    { value: '90d', label: 'Last 90 days', days: 90 },
    { value: 'all', label: 'All time', days: null },
  ]
  const activeRange = rangeOptions.find(option => option.value === revenueRange) || rangeOptions[1]
  const cutoffDate = activeRange.days
    ? new Date(new Date().setDate(new Date().getDate() - activeRange.days))
    : null
  const filteredOrders = cutoffDate
    ? orders.filter(order => new Date(order.createdAt) >= cutoffDate)
    : orders
  const filteredRevenueTotal = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const filteredAverageOrder = filteredOrders.length ? filteredRevenueTotal / filteredOrders.length : 0

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'pending'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const revenueByStatus = filteredOrders.reduce((acc, order) => {
    const status = order.status || 'pending'
    acc[status] = (acc[status] || 0) + (order.totalAmount || 0)
    return acc
  }, {})

  const revenueSegments = [
    { label: 'Delivered', key: 'delivered', color: '#22c55e' },
    { label: 'Shipped', key: 'shipped', color: '#6366f1' },
    { label: 'Confirmed', key: 'confirmed', color: '#38bdf8' },
    { label: 'Pending', key: 'pending', color: '#facc15' },
    { label: 'Cancelled', key: 'cancelled', color: '#f87171' },
  ].map((segment) => {
    const value = revenueByStatus[segment.key] || 0
    return { ...segment, value }
  })

  const revenueTotal = revenueSegments.reduce((sum, segment) => sum + segment.value, 0)
  const revenueGradient = revenueTotal
    ? revenueSegments.reduce((acc, segment, index) => {
      const start = acc.offset
      const share = (segment.value / revenueTotal) * 360
      const end = start + share
      acc.stops.push(`${segment.color} ${start}deg ${end}deg`)
      return { stops: acc.stops, offset: end }
    }, { stops: [], offset: 0 }).stops.join(', ')
    : '#e5e7eb 0deg 360deg'

  const stats = [
    { label: 'Total Products', value: products.length, color: 'primary' },
    { label: 'Orders Today', value: todayOrders.length, color: 'wine' },
    { label: 'Customers', value: regularUsers.length, color: 'blue' },
    { label: 'Total Orders', value: orders.length, color: 'purple' },
  ]

  return (
    <>
      <SEOHead title="Admin Dashboard" description="Manage your Candour Jewelry e-commerce store, products, orders, and customers." />
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-elegant font-bold text-dark-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-dark-600 dark:text-dark-300">Welcome back! Here's your store overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-700 rounded-xl p-6 shadow-md border border-gray-200 dark:border-dark-700">
              <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-dark-500 dark:text-dark-300">Revenue Breakdown</p>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                  ${filteredRevenueTotal.toFixed(2)}
                </h2>
                <p className="text-xs text-dark-400 dark:text-dark-500">By order status</p>
                <div className="mt-4">
                  <label className="text-xs uppercase tracking-wide text-dark-400 dark:text-dark-500">Time Range</label>
                  <select
                    value={revenueRange}
                    onChange={(event) => setRevenueRange(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 px-3 py-2 text-sm text-dark-700 dark:text-dark-100"
                  >
                    {rangeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-2">
                  {revenueSegments.map((segment) => {
                    const share = revenueTotal ? Math.round((segment.value / revenueTotal) * 100) : 0
                    return (
                      <div key={segment.key} className="flex items-center justify-between text-sm text-dark-600 dark:text-dark-300">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span>{segment.label}</span>
                        </div>
                        <span>${segment.value.toFixed(2)} · {share}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div
                  className="h-44 w-44 rounded-full flex items-center justify-center"
                  style={{ background: `conic-gradient(${revenueGradient})` }}
                >
                  <div className="h-28 w-28 rounded-full bg-white dark:bg-dark-800 flex items-center justify-center text-center">
                    <div>
                      <p className="text-xs text-dark-500 dark:text-dark-300">Avg Order</p>
                      <p className="text-lg font-semibold text-dark-900 dark:text-white">
                        ${filteredAverageOrder.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-dark-400 dark:text-dark-500">Revenue share · {activeRange.label}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Order Status</h2>
            <div className="space-y-4">
              {[
                { label: 'Pending', key: 'pending', color: 'bg-yellow-400' },
                { label: 'Confirmed', key: 'confirmed', color: 'bg-blue-400' },
                { label: 'Shipped', key: 'shipped', color: 'bg-indigo-400' },
                { label: 'Delivered', key: 'delivered', color: 'bg-green-400' },
                { label: 'Cancelled', key: 'cancelled', color: 'bg-red-400' },
              ].map((status) => {
                const count = statusCounts[status.key] || 0
                const percent = orders.length ? Math.round((count / orders.length) * 100) : 0
                return (
                  <div key={status.key}>
                    <div className="flex justify-between text-sm text-dark-600 dark:text-dark-300 mb-1">
                      <span>{status.label}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-dark-700 rounded-full">
                      <div
                        className={`h-2 rounded-full ${status.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-dark-500 dark:text-dark-300">Fulfillment Rate</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">{fulfillmentRate}%</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Delivered vs total orders</p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-dark-500 dark:text-dark-300">Pending to Ship</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">
              {(statusCounts.pending || 0) + (statusCounts.confirmed || 0)}
            </p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Orders awaiting fulfillment</p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-dark-500 dark:text-dark-300">Repeat Customers</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">
              {orders.filter(order => order.user?._id).length > 0
                ? new Set(orders.map(order => order.user?._id).filter(Boolean)).size
                : 0}
            </p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Unique customers who ordered</p>
          </div>
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
