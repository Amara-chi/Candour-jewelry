import React, { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useModal } from '../../components/Modal';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import ProductGrid from '../../features/product/ProductsGrid';
import { AlertTriangle } from 'lucide-react';

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
    console.log(`Performing ${bulkAction} on:`, selectedProducts);
    setBulkAction('');
    setSelectedProducts([]);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-14 w-14 text-wine-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-700 dark:text-white mb-2">
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
            <h1 className="text-3xl lg:text-4xl font-bold text-dark-900 dark:text-white mb-2">
              Product Management
            </h1>
            <p className="text-dark-600 dark:text-gray-300">
              Manage your product catalog ({products.length} products)
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

        {/* Product Display */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onLoadMore={() => {
            if (pagination && pagination.page < pagination.pages) {
              updateFilters({ page: pagination.page + 1 });
            }
          }}
          hasMore={pagination && pagination.page < pagination.pages}
        />
      </div>
    </>
  );
};

export default ManageProducts;
