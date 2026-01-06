import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../features/product/productCard';
import { SEOHead } from '../../components/SEOHead';
import { useProducts } from '../../hooks/useProducts';
import Button from '../../components/Button';
import { useCategories } from '../../hooks/useCategories';

const Shop = () => {
  const [sortBy, setSortBy] = useState('-createdAt');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const { products, loading, error, pagination, updateFilters, mutate } = useProducts({
    sort: sortBy,
    status: 'active',
    page: 1,
    limit: 12
  });

  const { categories } = useCategories();

  const filteredProducts = products.filter(product => {
    if (selectedCategory && !product.categories?.some(cat => cat._id === selectedCategory)) return false;
    if (showInStockOnly && !product.inStock) return false;
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

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange([0, 10000]);
    setShowInStockOnly(false);
    setSortBy('-createdAt');
  };

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              Failed to load products
            </h2>
            <p className="text-dark-600 dark:text-dark-300 mb-4">{error}</p>
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
        <h1 className="text-4xl font-elegant font-bold text-dark-900 dark:text-white mb-8 text-center">
          Our Collections
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-dark-100 dark:border-dark-700 p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
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
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border border-dark-200 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
                    placeholder="Min"
                  />
                  <span className="self-center text-dark-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border border-dark-200 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
                    placeholder="Max"
                  />
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
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-dark-600 dark:text-dark-300">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
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

            {loading && filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-12 text-center">
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
                {filteredProducts.map((product, index) => (
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