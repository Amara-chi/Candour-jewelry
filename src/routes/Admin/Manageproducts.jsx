import React, { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useModal } from '../../components/Modal';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProductGrid from '../../features/product/ProductGrid';
// import ProductFilters from '../../features/product/ProductFilters';

const ManageProducts = () => {
  const { openModal } = useModal();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    mutate
  } = useProducts({ sort: sortBy, status: 'all' });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.inStock && !product.inStock) return false;
      if (filters.featured && !product.featured) return false;
      if (filters.category && !product.categories?.some(cat => cat._id === filters.category)) return false;
      if (filters.status && product.status !== filters.status) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.sku?.toLowerCase().includes(searchTerm) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      return true;
    });
  }, [products, filters]);

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    // Implement bulk actions here
    console.log(`Performing ${bulkAction} on:`, selectedProducts);
    
    // Reset after action
    setBulkAction('');
    setSelectedProducts([]);
  };

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const draft = products.filter(p => p.status === 'draft').length;
    const outOfStock = products.filter(p => p.trackQuantity && p.quantity === 0).length;
    const featured = products.filter(p => p.featured).length;

    return { total, active, draft, outOfStock, featured };
  }, [products]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to load products
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
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
        title="Product Management - Admin"
        description="Manage your product catalog"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-elegant font-bold text-white mb-2">
              Product Management
            </h1>
            <p className="text-gray-300">
              Manage your product catalog ({stats.total} products)
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => openModal('product-form', { mode: 'create' })}
            className="mt-4 lg:mt-0"
          >
            + Add New Product
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center p-4 bg-dark-800 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </Card>
          <Card className="text-center p-4 bg-dark-800 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-white">{stats.active}</div>
            <div className="text-sm text-gray-400">Active</div>
          </Card>
          <Card className="text-center p-4 bg-dark-800 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-white">{stats.draft}</div>
            <div className="text-sm text-gray-400">Draft</div>
          </Card>
          <Card className="text-center p-4 bg-dark-800 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-white">{stats.outOfStock}</div>
            <div className="text-sm text-gray-400">Out of Stock</div>
          </Card>
          <Card className="text-center p-4 bg-dark-800 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-white">{stats.featured}</div>
            <div className="text-sm text-gray-400">Featured</div>
          </Card>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <Card className="mb-6 p-4 bg-primary-900 border border-primary-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white">
                <strong>{selectedProducts.length}</strong> product(s) selected
              </div>
              <div className="flex gap-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                >
                  <option value="">Bulk Actions</option>
                  <option value="activate">Activate</option>
                  <option value="draft">Move to Draft</option>
                  <option value="archive">Archive</option>
                  <option value="delete">Delete</option>
                  <option value="feature">Feature</option>
                  <option value="unfeature">Unfeature</option>
                </select>
                <Button
                  variant="primary"
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  size="sm"
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts([])}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <EnhancedProductFilters
              filters={filters}
              onFilterChange={updateFilters}
              onClearFilters={() => updateFilters({
                search: '',
                category: '',
                priceRange: [0, 1000],
                inStock: false,
                featured: false,
                status: ''
              })}
            />
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Enhanced Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                {/* Select All */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-white">Select All</span>
                </label>
                
                <span className="text-sm text-gray-300">
                  {filteredProducts.length} of {products.length} products
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex border border-dark-600 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:bg-dark-700'
                    }`}
                  >
                    ▫️
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:bg-dark-700'
                    }`}
                  >
                    ☰
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="quantity">Quantity: Low to High</option>
                  <option value="-quantity">Quantity: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid/List */}
            {viewMode === 'grid' ? (
              <ProductGrid
                products={filteredProducts}
                loading={loading}
                onLoadMore={() => {
                  if (pagination && pagination.page < pagination.pages) {
                    updateFilters({ page: pagination.page + 1 });
                  }
                }}
                hasMore={pagination && pagination.page < pagination.pages}
                isAdmin={true}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
              />
            ) : (
              <ProductListView
                products={filteredProducts}
                loading={loading}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced Filters Component
const EnhancedProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 1000]);

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
    onFilterChange({ priceRange: newRange });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-500 hover:text-primary-400 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search products..."
          className="w-full px-3 py-2 border border-dark-600 rounded-lg bg-dark-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Status
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="w-full px-3 py-2 border border-dark-600 rounded-lg bg-dark-700 text-white text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(0, e.target.value)}
            className="w-20 px-2 py-1 border border-dark-600 rounded bg-dark-700 text-white text-sm"
            placeholder="Min"
          />
          <span className="self-center text-gray-400">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="w-20 px-2 py-1 border border-dark-600 rounded bg-dark-700 text-white text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="rounded border-gray-600 text-primary-500 focus:ring-primary-500 bg-dark-700"
          />
          <span className="ml-2 text-sm text-gray-300">In Stock Only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => onFilterChange({ featured: e.target.checked })}
            className="rounded border-gray-600 text-primary-500 focus:ring-primary-500 bg-dark-700"
          />
          <span className="ml-2 text-sm text-gray-300">Featured Only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.lowStock || false}
            onChange={(e) => onFilterChange({ lowStock: e.target.checked })}
            className="rounded border-gray-600 text-primary-500 focus:ring-primary-500 bg-dark-700"
          />
          <span className="ml-2 text-sm text-gray-300">Low Stock</span>
        </label>
      </div>
    </Card>
  );
};

// List View Component
const ProductListView = ({ products, loading, selectedProducts, onSelectProduct }) => {
  const { openModal } = useModal();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <Card className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
        <p className="text-gray-400">Try adjusting your search filters</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product._id} className="p-4 hover:bg-dark-700 transition-colors">
          <div className="flex items-center gap-4">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={(e) => onSelectProduct(product._id, e.target.checked)}
              className="rounded border-gray-600 text-primary-500 focus:ring-primary-500"
            />

            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-2xl">💎</span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-sm text-gray-400">SKU: {product.sku || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-500">${product.price}</p>
                  <p className="text-sm text-gray-400">
                    Stock: {product.trackQuantity ? product.quantity : '∞'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active' 
                    ? 'bg-green-500 text-white'
                    : product.status === 'draft'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {product.status}
                </span>
                {product.featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                    Featured
                  </span>
                )}
                {!product.inStock && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal('product-form', { product, mode: 'edit' })}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openModal('confirm-delete', { 
                  type: 'product',
                  id: product._id,
                  name: product.name 
                })}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ManageProducts;