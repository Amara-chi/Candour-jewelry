import MainLayout from '../../layouts/MainLayout'
import ProductCard from '../../features/product/productCard'
import { SEOHead } from '../../components/SEOHead'
import { useProducts } from '../../hooks/useProducts';

const Shop = () => {

   const { 
    products 
  } = useProducts();

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-red-500">
          {products.map((_, index) => (
            <ProductCard key={index} product={{}} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default Shop