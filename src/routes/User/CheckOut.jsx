import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { SEOHead } from '../../components/SEOHead';
import axios from 'axios';
import { API_URL } from '../../config/api';

const CheckOut = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    paymentMethod: 'card'
  });

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in to checkout</h2>
            <Link to="/"><Button>Go Home</Button></Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link to="/shop"><Button>Continue Shopping</Button></Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/orders`,
        {
          shippingAddress: formData,
          shippingEmail: user.email,
          paymentMethod: formData.paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate({ to: '/order-success', search: { orderId: response.data.data._id } });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEOHead 
        title="Checkout - Candour Jewelry"
        description="Complete your jewelry order securely"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Zip Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                  Payment Method
                </h2>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-dark-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-300">
                    {item.productName || 'Product'} x{item.quantity}
                  </span>
                  <span className="font-medium text-dark-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t border-dark-200 dark:border-dark-700 pt-3 flex justify-between font-bold text-dark-900 dark:text-white text-lg">
                <span>Total</span>
                <span>${cart.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/cart">
              <Button variant="outline" size="md" className="w-full justify-center">
                Edit Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckOut;
