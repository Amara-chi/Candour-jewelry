import React, { useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import { SEOHead } from '../../components/SEOHead';
import { Gem, Heart, ShieldCheck, Sparkles, Truck } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const images = product?.images || [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const selectedImage = images[selectedImageIndex] || primaryImage;

  const productHighlights = useMemo(() => {
    if (product?.tags?.length) return product.tags.slice(0, 4);
    return ['Handcrafted finish', 'Ethically sourced materials', 'Gift-ready packaging', 'Atelier warranty'];
  }, [product?.tags]);

  const hasDimensions = Boolean(product?.dimensions?.length || product?.dimensions?.width || product?.dimensions?.height);
  const dimensions = product?.dimensions
    ? `${product.dimensions.length || '-'} x ${product.dimensions.width || '-'} x ${product.dimensions.height || '-'} ${product.dimensions.unit || ''}`.trim()
    : null;

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
        <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-300 mb-6">
          <Link to="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-500">Shop</Link>
          <span>/</span>
          <span className="text-dark-700 dark:text-dark-100">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg">
            <div className="relative w-full h-[420px] bg-gradient-to-br from-primary-200 to-wine-200 rounded-2xl flex items-center justify-center overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gem className="h-16 w-16 text-primary-600" />
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-6">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    type="button"
                    key={image._id || image.url}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-20 rounded-xl overflow-hidden border transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary-500 ring-2 ring-primary-300'
                        : 'border-transparent hover:border-primary-200'
                    }`}
                  >
                    <img src={image.url} alt={image.alt || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300 mb-3">
                {product.categories?.[0]?.name || 'Signature Collection'}
              </p>
              <h1 className="text-4xl font-elegant font-bold text-dark-900 dark:text-white">
                {product.name}
              </h1>
              <p className="mt-3 text-dark-600 dark:text-dark-300 text-lg">
                {product.shortDescription || product.description || 'Premium handcrafted jewelry designed to last.'}
              </p>
            </div>

            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-primary-500">${product.price}</p>
              {product.comparePrice > product.price && (
                <p className="text-sm text-dark-400 line-through">${product.comparePrice}</p>
              )}
              {product.comparePrice > product.price && (
                <span className="text-xs rounded-full bg-green-100 text-green-700 px-2 py-1">
                  Save ${(product.comparePrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-dark-600 dark:text-dark-300">
              <div className="rounded-2xl border border-primary-100/70 dark:border-dark-700 p-4 bg-white/70 dark:bg-dark-800/60">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                  <Sparkles className="h-4 w-4" />
                  Highlights
                </div>
                <ul className="space-y-1">
                  {productHighlights.map((highlight) => (
                    <li key={highlight}>• {highlight}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-primary-100/70 dark:border-dark-700 p-4 bg-white/70 dark:bg-dark-800/60">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                  <Truck className="h-4 w-4" />
                  Delivery
                </div>
                <p>Ships in 2–4 business days with insured delivery.</p>
                <p className="mt-2">Complimentary gift packaging included.</p>
              </div>
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

            <div className="grid gap-4 pt-4 border-t border-dark-100 dark:border-dark-700 text-sm text-dark-600 dark:text-dark-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-dark-400">SKU</p>
                  <p>{product.sku || '—'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-dark-400">Availability</p>
                  <p>{product.inStock ? 'In stock' : 'Made to order'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-dark-400">Weight</p>
                  <p>{product.weight?.value ? `${product.weight.value}${product.weight.unit || 'g'}` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-dark-400">Dimensions</p>
                  <p>{hasDimensions ? dimensions : '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dark-400">Care</p>
                <p>Store in a dry pouch and polish gently with a soft cloth after wear.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-primary-500">
                <ShieldCheck className="h-4 w-4" />
                Complimentary resizing within 30 days.
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <section className="mt-16 bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white mb-4">
              Product Details
            </h2>
            <p className="text-dark-600 dark:text-dark-300 leading-relaxed">
              {product.description}
            </p>
          </section>
        )}
      </div>
    </MainLayout>
  )
}

export default ProductDetails
