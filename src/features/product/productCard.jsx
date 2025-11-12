import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useModal } from '../../components/Modal';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import { LazyImage } from '../../components/LazyImage';

const ProductCard = ({ product, isAdmin = false, priority = false }) => {
  const { openModal } = useModal();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      openModal('login');
      return;
    }

    try {
      await addToCart({
        product: product._id,
        quantity: 1,
        price: product.price
      });
      
      // Show success feedback (you can add a toast here)
      console.log('Added to cart:', product.name);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal('product-form', { product, mode: 'edit' });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal('confirm-delete', { 
      type: 'product',
      id: product._id,
      name: product.name 
    });
  };

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  return (
    <div className="group relative bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-dark-100 dark:border-dark-700">
      {/* Admin Actions Overlay */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onClick={handleEdit}
            className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-colors"
            title="Edit Product"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-wine-500 hover:bg-wine-600 text-white rounded-full shadow-lg transition-colors"
            title="Delete Product"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Product Status Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {!product.inStock && (
          <span className="bg-wine-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </span>
        )}
        {product.featured && (
          <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
        {product.comparePrice > product.price && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Sale
          </span>
        )}
        {/* Admin-only status badge */}
        {isAdmin && product.status && (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.status === 'active' 
              ? 'bg-green-500 text-white'
              : product.status === 'draft'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {product.status}
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.slug || product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-600">
          {primaryImage ? (
            <LazyImage
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-wine-200">
              <span className="text-4xl">💎</span>
            </div>
          )}
          
          {/* Loading Skeleton */}
          {!imageLoaded && primaryImage && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse" />
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.categories?.[0] && (
          <p className="text-xs text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-1">
            {product.categories[0].name}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="font-semibold text-dark-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-dark-600 dark:text-dark-300 text-sm mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary-500 dark:text-primary-400">
            ${product.price}
          </span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-dark-500 dark:text-dark-400 line-through">
              ${product.comparePrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isAdmin ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleQuickAdd}
                disabled={!product.inStock}
                className="flex-1 justify-center"
              >
                {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  openModal('product-details', { product });
                }}
                className="px-3"
              >
                👁️
              </Button>
            </>
          ) : (
            // Admin info and actions
            <div className="w-full">
              <div className="text-xs text-dark-500 dark:text-dark-400 space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span>{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span>{product.trackQuantity ? product.quantity : '∞'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{product.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex-1 justify-center text-xs"
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openModal('product-details', { product, isAdmin: true })}
                  className="flex-1 justify-center text-xs"
                >
                  View
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;