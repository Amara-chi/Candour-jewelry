import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../features/product/productCard';
import { SEOHead } from '../../components/SEOHead';
import { useProducts } from '../../hooks/useProducts';
import Button from '../../components/Button';
import { useCategories } from '../../hooks/useCategories';
import Spinner from '../../components/Spinner';

const Shop = () => {
  const [sortBy, setSortBy] = useState('-createdAt');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { products, loading, error, mutate } = useProducts({
    sort: sortBy,
    status: 'active',
    page: 1,
    limit: 12
  });

  const { categories } = useCategories();

  const priceBounds = useMemo(() => {
    if (!products.length) return [0, 10000];
    const prices = products.map(product => Number(product.price)).filter(price => !Number.isNaN(price));
    const max = prices.length ? Math.max(...prices, 1000) : 1000;
    const roundedMax = Math.ceil(max / 100) * 100;
    return [0, roundedMax];
  }, [products]);

  useEffect(() => {
    setPriceRange((prev) => [
      Math.min(prev[0], priceBounds[1]),
      Math.min(prev[1], priceBounds[1])
    ]);
  }, [priceBounds]);

  const defaultPriceRange = useMemo(() => [priceBounds[0], priceBounds[1]], [priceBounds]);

  const handleMinPriceChange = (value) => {
    const nextValue = Math.min(value, priceRange[1]);
    setPriceRange([nextValue, priceRange[1]]);
  };

  const handleMaxPriceChange = (value) => {
    const nextValue = Math.max(value, priceRange[0]);
    setPriceRange([priceRange[0], nextValue]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory && !product.categories?.some(cat => cat._id === selectedCategory)) return false;
      if (showInStockOnly && !product.inStock) return false;
      if (showFeaturedOnly && !product.featured) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [products, priceRange, searchQuery, selectedCategory, showFeaturedOnly, showInStockOnly]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'createdAt':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case '-createdAt':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'name':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case '-name':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'price':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case '-price':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const totalProducts = products.length;
  const resultsCount = sortedProducts.length;

  const hasActiveFilters = Boolean(
    selectedCategory ||
    searchQuery ||
    showInStockOnly ||
    showFeaturedOnly ||
    priceRange[0] > defaultPriceRange[0] ||
    priceRange[1] < defaultPriceRange[1]
  );

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return '';
    return categories.find(category => category._id === selectedCategory)?.name || 'Selected Category';
  }, [categories, selectedCategory]);

  const appliedFilters = [
    searchQuery && {
      label: `Search: "${searchQuery}"`,
      onRemove: () => setSearchQuery('')
    },
    selectedCategory && {
      label: `Category: ${selectedCategoryName}`,
      onRemove: () => setSelectedCategory('')
    },
    showInStockOnly && {
      label: 'In Stock',
      onRemove: () => setShowInStockOnly(false)
    },
    showFeaturedOnly && {
      label: 'Featured',
      onRemove: () => setShowFeaturedOnly(false)
    },
    (priceRange[0] > defaultPriceRange[0] || priceRange[1] < defaultPriceRange[1]) && {
      label: `Price: $${priceRange[0]} - $${priceRange[1]}`,
      onRemove: () => setPriceRange([defaultPriceRange[0], defaultPriceRange[1]])
    }
  ].filter(Boolean);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange([defaultPriceRange[0], defaultPriceRange[1]]);
    setShowInStockOnly(false);
    setShowFeaturedOnly(false);
    setSortBy('-createdAt');
  };

  if (error && !loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-14 w-14 text-wine-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              Unable to Load Products
            </h2>
            <p className="text-dark-600 dark:text-dark-300 mb-4">{error}</p>
            <p className="text-sm text-dark-500 dark:text-dark-400 mb-6">
              Please check your connection and try again
            </p>
            <Button variant="primary" onClick={() => mutate()}>
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
        title="Shop - Candour Jewelry | Premium Gold & Diamond Collections"
        description="Explore our exquisite collection of handcrafted gold jewelry and luxury diamond pieces. Premium quality at affordable prices."
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300 mb-3">
            Handcrafted Luxury
          </p>
          <h1 className="text-4xl md:text-5xl font-elegant font-bold text-dark-900 dark:text-white">
            Our Collections
          </h1>
          <p className="mt-3 text-dark-600 dark:text-dark-300 max-w-2xl mx-auto">
            Browse refined pieces curated for every celebration. Filter by category, price, and availability to find your perfect match.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-100 dark:border-dark-700 p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Filters</h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400">
                    {appliedFilters.length} active
                  </p>
                </div>
                <button
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium disabled:text-dark-300 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, stone, or style..."
                    className="w-full pl-10 pr-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">🔍</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Price Range
                </label>
                <div className="flex items-center justify-between text-xs text-dark-500 dark:text-dark-400 mb-3">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={priceBounds[0]}
                    max={priceBounds[1]}
                    value={priceRange[0]}
                    onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <input
                    type="range"
                    min={priceBounds[0]}
                    max={priceBounds[1]}
                    value={priceRange[1]}
                    onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                      value={priceRange[0]}
                      onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                      className="w-24 px-2 py-1 border border-dark-200 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
                      placeholder="Min"
                    />
                    <span className="self-center text-dark-500">-</span>
                    <input
                      type="number"
                      min={priceBounds[0]}
                      max={priceBounds[1]}
                      value={priceRange[1]}
                      onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                      className="w-24 px-2 py-1 border border-dark-200 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-dark-700 dark:text-dark-300">In Stock Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-dark-700 dark:text-dark-300">Featured Pieces</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/70 dark:bg-dark-800/70 rounded-2xl border border-dark-100 dark:border-dark-700 shadow-sm p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400 uppercase tracking-[0.3em]">
                    Collection Overview
                  </p>
                  <p className="text-xl font-semibold text-dark-900 dark:text-white">
                    Showing {resultsCount} of {totalProducts} pieces
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-dark-600 dark:text-dark-300">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-name">Name: Z to A</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                  </select>
                </div>
              </div>
              {appliedFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {appliedFilters.map((filter) => (
                    <button
                      key={filter.label}
                      onClick={filter.onRemove}
                      className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition hover:bg-primary-100"
                    >
                      {filter.label}
                      <span className="text-primary-500">✕</span>
                    </button>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-dark-500 hover:text-primary-500"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {loading && resultsCount === 0 ? (
              <Spinner className="py-12" size={52} />
            ) : resultsCount === 0 ? (
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-dark-600 dark:text-dark-300 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="primary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    priority={index < 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Shop;
