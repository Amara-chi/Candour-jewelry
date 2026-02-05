import React, { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import { SEOHead } from '../../components/SEOHead';
import { Gem, Heart, ShieldCheck } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../components/Modal';

const ProductDetails = () => {
  const { id } = useParams({ from: '/product/$id' });
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    if (!product?._id) return;
    if (!isAuthenticated) {
      openModal('login');
      return;
    }

    setActionLoading(true);
    setMessage('');
    try {
      await addToCart(product._id, 1);
      setMessage('Added to cart successfully.');
    } catch (addError) {
      console.error('Failed to add to cart:', addError);
      setMessage('Unable to add to cart right now. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const primaryImage = product?.images?.find((img) => img.isPrimary) || product?.images?.[0];

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size={52} />
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              Unable to load product
            </h2>
            <p className="text-dark-600 dark:text-dark-300">
              {error || 'Please try again later.'}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEOHead 
        title={`${product.name} | Candour Jewelry`}
        description={product.shortDescription || product.description || 'Discover handcrafted jewelry from Candour Jewelry.'}
        image={primaryImage?.url}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 sm:p-8">
            <div className="w-full h-72 sm:h-96 bg-gradient-to-br from-primary-200 to-wine-200 rounded-lg flex items-center justify-center overflow-hidden">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gem className="h-16 w-16 text-primary-600" />
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {product.images.slice(0, 3).map((image) => (
                  <div key={image._id || image.url} className="h-20 sm:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
                    <img src={image.url} alt={image.alt || product.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-elegant font-bold text-dark-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-primary-500">${product.price}</p>
            <p className="text-dark-600 dark:text-dark-300 text-base sm:text-lg">
              {product.description || product.shortDescription || 'Premium handcrafted jewelry designed to last.'}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-dark-500 dark:text-dark-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-primary-500" />
                Lifetime polishing support
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 px-3 py-1">
                <Gem className="h-4 w-4 text-primary-500" />
                Hand-finished in the atelier
              </span>
            </div>
            
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={handleAddToCart}
                disabled={!product.inStock || actionLoading}
              >
                {product.inStock ? (actionLoading ? 'Adding...' : 'Add to Cart') : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center"
                disabled
              >
                <Heart className="h-4 w-4 mr-2" />
                Wishlist (coming soon)
              </Button>
            </div>

            {message && (
              <p className="text-sm text-primary-500">{message}</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProductDetails
