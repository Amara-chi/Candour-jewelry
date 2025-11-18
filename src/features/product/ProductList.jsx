import React, { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilter';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import { useModal } from '../../components/Modal';

const ProductList = ({ isAdmin = false }) => {
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
      
      
    </>
  );
};

export default ProductList;