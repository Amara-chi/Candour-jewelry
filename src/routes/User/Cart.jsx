import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import { useCart } from '../../hooks/useCart';
import { LazyImage } from '../../components/LazyImage';
import Button from '../../components/Button';
import { SEOHead } from '../../components/SEOHead';
import Spinner from '../../components/Spinner';
import { AlertTriangle, Gem, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, getCart, updateQuantity, removeItem, clearCart: clear, loading, error } = useCart();
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCart();
    }
  }, [getCart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setActionLoading(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setActionLoading(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setActionLoading('clear');
      try {
        await clear();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        alert('Failed to clear cart. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading && (!cart.items || cart.items.length === 0)) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Spinner className="mb-4" size={52} />
            <p className="text-dark-600 dark:text-dark-300">Loading your cart...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-14 w-14 text-wine-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              Failed to load cart
            </h2>
            <p className="text-dark-600 dark:text-dark-300 mb-4">{error}</p>
            <Button variant="primary" onClick={() => getCart()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEOHead
        title="Shopping Cart - Candour Jewelry"
        description="Review your cart and proceed to checkout"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-8">
          Shopping Cart
        </h1>

        {!cart.items || cart.items.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <div className="text-center py-12">
              <ShoppingBag className="h-14 w-14 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Your cart is empty
              </h3>
              <p className="text-dark-500 dark:text-dark-400 mb-6">
                Discover our beautiful jewelry collection and add some sparkle to your cart!
              </p>
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                    <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
                      {item.product?.images?.[0] ? (
                        <LazyImage
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gem className="h-6 w-6 text-primary-500" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                      <h3 className="font-semibold text-dark-900 dark:text-white mb-1 hover:text-primary-500 transition-colors">
                        {item.product?.name || 'Product'}
                      </h3>
                    </Link>
                    <p className="text-primary-500 dark:text-primary-400 font-bold">
                      ${item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-dark-300 dark:border-dark-600 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1 || actionLoading === item._id}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium text-dark-900 dark:text-white">
                        {actionLoading === item._id ? (
                          <Spinner size={16} />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-dark-300 dark:border-dark-600 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={actionLoading === item._id}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-0 sm:mt-0">
                    <p className="font-bold text-dark-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-wine-500 hover:text-wine-600 text-sm font-medium transition-colors disabled:opacity-50"
                      disabled={actionLoading === item._id}
                    >
                      {actionLoading === item._id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="text-wine-500 hover:text-wine-600 text-sm font-medium disabled:opacity-50"
                disabled={actionLoading === 'clear'}
              >
                {actionLoading === 'clear' ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-dark-700 dark:text-dark-300">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span>${cart.totalPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-dark-700 dark:text-dark-300">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-dark-200 dark:border-dark-700 pt-3 flex justify-between font-bold text-dark-900 dark:text-white text-lg">
                    <span>Total</span>
                    <span>${cart.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button variant="primary" size="lg" className="w-full justify-center mb-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link to="/shop">
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
