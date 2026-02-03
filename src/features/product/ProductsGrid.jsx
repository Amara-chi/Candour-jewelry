// components/ProductGrid.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import ProductCard from './productCard';
import Spinner from '../../components/Spinner';
import { Package } from 'lucide-react';

const ProductsGrid = ({ 
  products, 
  loading, 
  onLoadMore, 
  hasMore, 
  selectedProducts = [],
  onSelectProduct,
  isAdmin = false
}) => {
  const [loadMoreRef, inView] = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  if (!products.length && !loading) {
    return (
      <div className="text-center py-12">
        <Package className="h-14 w-14 text-primary-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search filters or create a new product
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product._id || product._tempId || index}
            product={product}
            priority={index < 4}
            isAdmin={isAdmin}
            isSelected={selectedProducts.includes(product._id)}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <Spinner className="py-8" size={48} />
      )}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          {loading && (
            <Spinner size={24} />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
