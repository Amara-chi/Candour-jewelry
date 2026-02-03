import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from '@tanstack/react-router'
import { API_URL } from '../../config/api'
import { SEOHead } from '../../components/SEOHead'
import Spinner from '../../components/Spinner'

const OrderDetails = () => {
  const { id } = useParams({ from: '/admin/orders/$id' })
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrder(response.data?.data || null)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const shippingAddress = order?.shippingAddress
  const addressParts = [
    shippingAddress?.street,
    shippingAddress?.city,
    shippingAddress?.state,
    shippingAddress?.zipCode,
    shippingAddress?.country
  ].filter(Boolean)

  return (
    <>
      <SEOHead title="Order Details - Admin" description="Detailed view of a customer order." />
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm text-dark-500 dark:text-dark-300">Order Details</p>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
              #{order?._id?.slice(-8) || 'Loading'}
            </h1>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-dark-600 px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-200 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            ← Back to Orders
          </Link>
        </div>

        {loading ? (
          <Spinner className="py-12" size={52} />
        ) : !order ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 p-8 text-center text-dark-500">
            Unable to load this order.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Order Items</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200 dark:border-dark-700">
                      <tr>
                        <th className="text-left py-2 text-dark-600 dark:text-dark-300">Product</th>
                        <th className="text-left py-2 text-dark-600 dark:text-dark-300">Qty</th>
                        <th className="text-left py-2 text-dark-600 dark:text-dark-300">Price</th>
                        <th className="text-left py-2 text-dark-600 dark:text-dark-300">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item._id} className="border-b border-gray-100 dark:border-dark-700">
                          <td className="py-3 text-dark-900 dark:text-white">
                            {item.product?.name || item.productName || 'Product'}
                          </td>
                          <td className="py-3 text-dark-600 dark:text-dark-300">{item.quantity}</td>
                          <td className="py-3 text-dark-900 dark:text-white">${item.price?.toFixed(2)}</td>
                          <td className="py-3 text-dark-900 dark:text-white font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Shipping & Payment</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-100 dark:border-dark-700 p-4">
                    <p className="text-sm font-medium text-dark-500 dark:text-dark-300">Shipping Address</p>
                    <p className="text-dark-900 dark:text-white mt-2">
                      {addressParts.length ? addressParts.join(', ') : 'No address provided'}
                    </p>
                    <p className="text-sm text-dark-500 dark:text-dark-300 mt-3">Email</p>
                    <p className="text-dark-900 dark:text-white">{order.shippingEmail || order.user?.email}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 dark:border-dark-700 p-4">
                    <p className="text-sm font-medium text-dark-500 dark:text-dark-300">Payment Details</p>
                    <p className="text-dark-900 dark:text-white mt-2">Method: {order.paymentMethod || 'N/A'}</p>
                    <p className="text-dark-900 dark:text-white">Status: {order.paymentStatus || 'pending'}</p>
                    <p className="text-dark-900 dark:text-white">Total: ${order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-dark-600 dark:text-dark-300">
                    <span>Customer</span>
                    <span className="text-dark-900 dark:text-white">{order.user?.name || 'Guest'}</span>
                  </div>
                  <div className="flex justify-between text-dark-600 dark:text-dark-300">
                    <span>Status</span>
                    <span className="capitalize text-dark-900 dark:text-white">{order.status}</span>
                  </div>
                  <div className="flex justify-between text-dark-600 dark:text-dark-300">
                    <span>Placed</span>
                    <span className="text-dark-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-dark-600 dark:text-dark-300">
                    <span>Items</span>
                    <span className="text-dark-900 dark:text-white">{order.items?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-500/10 to-white dark:from-primary-500/20 dark:to-dark-800 rounded-xl p-6">
                <p className="text-sm text-dark-500 dark:text-dark-300">Order Notes</p>
                <p className="text-dark-900 dark:text-white mt-2">
                  {order.notes || 'No additional notes provided.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrderDetails
