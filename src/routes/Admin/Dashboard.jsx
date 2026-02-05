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
  const [totalProducts, setTotalProducts] = useState(null)
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
      const fetchedProducts = response.data?.data || []
      const paginationTotal = response.data?.pagination?.total
      setProducts(fetchedProducts)
      setTotalProducts(typeof paginationTotal === 'number' ? paginationTotal : null)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setTotalProducts(null)
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
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length
  const fulfillmentRate = orders.length ? Math.round((deliveredOrders / orders.length) * 100) : 0

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'pending'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const revenueByDay = orders.reduce((acc, order) => {
    const dayKey = new Date(order.createdAt).toDateString()
    acc[dayKey] = (acc[dayKey] || 0) + (order.totalAmount || 0)
    return acc
  }, {})

  const buildRevenueSeries = (days) => {
    const buckets = days > 14 ? 7 : 1
    const dailyValues = Array.from({ length: days }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - index))
      const key = date.toDateString()
      return { date, value: revenueByDay[key] || 0 }
    })

    if (buckets === 1) {
      return dailyValues.map((item) => ({
        label: item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: item.value
      }))
    }

    const grouped = []
    for (let i = 0; i < dailyValues.length; i += buckets) {
      const chunk = dailyValues.slice(i, i + buckets)
      const start = chunk[0].date
      const end = chunk[chunk.length - 1].date
      const label = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}-${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      grouped.push({
        label,
        value: chunk.reduce((sum, item) => sum + item.value, 0)
      })
    }
    return grouped
  }

  const revenueRangeDays = {
    '7d': 7,
    '30d': 30,
    '90d': 90
  }

  const revenueSeries = buildRevenueSeries(revenueRangeDays[revenueRange] || 30)

  const maxRevenue = Math.max(...revenueSeries.map(item => item.value), 0)
  const revenueRangeTotal = revenueSeries.reduce((sum, item) => sum + item.value, 0)
  const averageDailyRevenue = revenueRangeDays[revenueRange]
    ? revenueRangeTotal / revenueRangeDays[revenueRange]
    : 0

  const stats = [
    { label: 'Total Products', value: totalProducts ?? products.length, color: 'primary' },
    { label: 'Orders Today', value: todayOrders.length, color: 'wine' },
    { label: 'Customers', value: regularUsers.length, color: 'blue' },
    { label: 'Total Orders', value: orders.length, color: 'purple' },
  ]

  const ordersWithUsers = orders.filter(order => order.user?._id)
  const customerOrderCounts = ordersWithUsers.reduce((acc, order) => {
    const id = order.user?._id
    if (!id) return acc
    acc[id] = (acc[id] || 0) + 1
    return acc
  }, {})
  const uniqueCustomers = Object.keys(customerOrderCounts).length
  const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length
  const returningRate = uniqueCustomers ? Math.round((returningCustomers / uniqueCustomers) * 100) : 0

  const daysAgo = (days) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }
  const last7Orders = orders.filter(order => new Date(order.createdAt) >= daysAgo(7))
  const prev7Orders = orders.filter(order => {
    const createdAt = new Date(order.createdAt)
    return createdAt >= daysAgo(14) && createdAt < daysAgo(7)
  })
  const orderVelocity = last7Orders.length - prev7Orders.length
  const orderVelocityLabel = `${orderVelocity >= 0 ? '+' : ''}${orderVelocity}`
  const orderVelocityTone = orderVelocity >= 0 ? 'text-green-500' : 'text-red-500'
  const topRevenueSlot = revenueSeries.reduce((top, item) => {
    if (!top || item.value > top.value) return item
    return top
  }, null)

  return (
    <>
      <SEOHead title="Admin Dashboard" description="Manage your Candour Jewelry e-commerce store, products, orders, and customers." />
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="mb-10 rounded-3xl border border-primary-100/60 dark:border-dark-700 bg-gradient-to-r from-primary-50 via-white to-wine-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-500">Admin Overview</p>
              <h1 className="text-4xl lg:text-5xl font-elegant font-bold text-dark-900 dark:text-white mt-2">
                Candour Jewelry Analytics
              </h1>
              <p className="text-dark-600 dark:text-dark-300 mt-3 max-w-2xl">
                Track performance, monitor revenue trends, and stay on top of fulfillment with real-time store insights.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur rounded-2xl px-5 py-4 shadow-md">
                <p className="text-xs uppercase text-dark-400 dark:text-dark-500">Revenue Range</p>
                <div className="mt-3 flex items-center gap-2">
                  {['7d', '30d', '90d'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setRevenueRange(range)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        revenueRange === range
                          ? 'bg-primary-500 text-white shadow'
                          : 'bg-white dark:bg-dark-700 text-dark-600 dark:text-dark-300'
                      }`}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur rounded-2xl px-5 py-4 shadow-md">
                <p className="text-xs uppercase text-dark-400 dark:text-dark-500">Order Velocity</p>
                <p className={`text-2xl font-bold ${orderVelocityTone}`}>{orderVelocityLabel}</p>
                <p className="text-xs text-dark-400 dark:text-dark-500">vs previous 7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="relative overflow-hidden bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-dark-700">
              <div className={`absolute top-0 right-0 h-20 w-20 rounded-full blur-2xl opacity-30 ${
                stat.color === 'primary' ? 'bg-primary-400'
                  : stat.color === 'wine' ? 'bg-wine-400'
                  : stat.color === 'blue' ? 'bg-blue-400'
                  : 'bg-purple-400'
              }`} />
              <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </p>
              <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Updated just now</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
              <div>
                <p className="text-sm text-dark-500 dark:text-dark-300">Revenue Trend</p>
                <h2 className="text-3xl font-bold text-dark-900 dark:text-white">
                  ${revenueRangeTotal.toFixed(2)}
                </h2>
                <p className="text-xs text-dark-400 dark:text-dark-500">
                  {revenueRangeDays[revenueRange] || 30}-day total • Avg daily ${averageDailyRevenue.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-dark-700 px-4 py-3">
                <p className="text-xs text-dark-500 dark:text-dark-300">Best Window</p>
                <p className="text-lg font-semibold text-dark-900 dark:text-white">
                  {topRevenueSlot ? topRevenueSlot.label : 'N/A'}
                </p>
                <p className="text-xs text-dark-400 dark:text-dark-500">
                  ${topRevenueSlot ? topRevenueSlot.value.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-3 h-44">
              {revenueSeries.map((item) => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 dark:bg-dark-700 rounded-full h-32 flex items-end">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-primary-500 via-wine-400 to-wine-300 shadow"
                      style={{ height: maxRevenue ? `${Math.max((item.value / maxRevenue) * 100, 8)}%` : '8%' }}
                    />
                  </div>
                  <span className="text-[10px] text-dark-500 dark:text-dark-300 text-center leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-dark-700">
            <p className="text-sm text-dark-500 dark:text-dark-300">Fulfillment Rate</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">{fulfillmentRate}%</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Delivered vs total orders</p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-dark-700">
            <p className="text-sm text-dark-500 dark:text-dark-300">Pending to Ship</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">
              {(statusCounts.pending || 0) + (statusCounts.confirmed || 0)}
            </p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Orders awaiting fulfillment</p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-dark-700">
            <p className="text-sm text-dark-500 dark:text-dark-300">Returning Customers</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white mt-3">{returningRate}%</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">Share of customers with repeat orders</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 mb-10 border border-gray-100 dark:border-dark-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="text-sm text-dark-500 dark:text-dark-400">Jump straight into key management areas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/products">
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary-500/20">
                Manage Products
              </button>
            </Link>
            <Link to="/admin/orders">
              <button className="w-full bg-wine-500 hover:bg-wine-600 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-wine-500/20">
                View Orders
              </button>
            </Link>
            <Link to="/admin/categories">
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-purple-500/20">
                Manage Categories
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-dark-700">
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
