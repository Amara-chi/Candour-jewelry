import React from 'react';
import ProductCard from './productCard';
import { useInView } from 'react-intersection-observer';

const ProductsGrid = ({ 
  products, 
  loading, 
  onLoadMore, 
  hasMore, 
  isAdmin = false,
  selectedProducts = [],
  onSelectProduct 
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
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-400">
          Try adjusting your search filters
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
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;