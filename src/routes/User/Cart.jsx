import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import { useCart } from '../../hooks/useCart';
import { LazyImage } from '../../components/LazyImage';
import Button from '../../components/Button';
import { SEOHead } from '../../components/SEOHead';

const CartPage = () => {
  const { cart, getCart, updateQuantity, removeItem, clearCart: clear, loading } = useCart();

  useEffect(() => {
    // Fetch cart when user navigates to cart page
    const token = localStorage.getItem('token');
    if (token) {
      getCart();
    }
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clear();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (loading && !cart.items.length) {
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
        title="Shopping Cart - Candour Jewelry"
        description="Review your cart and proceed to checkout"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-8">
          Shopping Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🛒</span>
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
                  className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
                      {item.product?.images?.[0] ? (
                        <LazyImage
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">💎</span>
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
                        className="w-8 h-8 rounded-full border border-dark-300 dark:border-dark-600 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center justify-center transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium text-dark-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-dark-300 dark:border-dark-600 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold text-dark-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-wine-500 hover:text-wine-600 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="text-wine-500 hover:text-wine-600 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 sticky top-4">
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
