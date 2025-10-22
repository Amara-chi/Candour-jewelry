import MainLayout from '../../layouts/MainLayout'
import ProductCard from '../../features/product/productCard'

const Shop = () => {
  const products = Array(9).fill(0) // Placeholder products

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-elegant font-bold text-dark-900 dark:text-white mb-8 text-center">
          Our Collection
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((_, index) => (
            <ProductCard key={index} product={{}} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default Shop