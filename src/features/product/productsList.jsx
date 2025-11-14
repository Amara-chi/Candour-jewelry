import React, { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilter';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import { useModal } from '../../components/Modal';

const ProductsList = ({ isAdmin = false }) => {
  const { openModal } = useModal();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('-createdAt');
  
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    mutate
  } = useProducts({ sort: sortBy });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.inStock && !product.inStock) return false;
      if (filters.featured && !product.featured) return false;
      if (filters.category && !product.categories?.some(cat => cat._id === filters.category)) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      return true;
    });
  }, [products, filters]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.pages) {
      updateFilters({ page: pagination.page + 1 });
    }
  };

  if (error) {
    const errorMessage = typeof error === 'string' ? error : 
                         error?.message || 'An unknown error occurred';
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Failed to load products
          </h2>
          <p className="text-dark-600 dark:text-dark-300 mb-4">{errorMessage}</p>
          <Button variant="primary" onClick={() => mutate()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Shop Collection - Candour's Jewelry"
        description="Discover our exquisite collection of handcrafted jewelry. Premium quality necklaces, rings, earrings, and bracelets for every occasion."
        keywords="jewelry, necklaces, rings, earrings, bracelets, handmade, luxury"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-elegant font-bold text-dark-900 dark:text-white mb-2">
              {isAdmin ? 'Product Management' : 'Our Collection'}
            </h1>
            <p className="text-dark-600 dark:text-dark-300">
              {isAdmin 
                ? `Manage your product catalog (${pagination?.total || 0} products)`
                : 'Discover timeless pieces crafted with passion'
              }
            </p>
          </div>
          
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => openModal('product-form')}
              className="mt-4 lg:mt-0"
            >
              + Add Product
            </Button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={updateFilters}
              onClearFilters={() => updateFilters({
                search: '',
                category: '',
                priceRange: [0, 1000],
                inStock: false,
                featured: false
              })}
            />
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-dark-600 dark:text-dark-300">
                  {pagination?.total || 0} products
                </span>
                
                {/* View Mode Toggle */}
                <div className="flex border border-dark-200 dark:border-dark-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid'
                        ? 'bg-primary-500 text-white'
                        : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    ▫️
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    ☰
                  </button>
                </div>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
                <option value="-featured">Featured First</option>
              </select>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onLoadMore={handleLoadMore}
              hasMore={pagination && pagination.page < pagination.pages}
              viewMode={viewMode}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsList;