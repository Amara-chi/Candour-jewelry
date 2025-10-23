import MainLayout from '../../layouts/MainLayout'
import ProductCard from '../../features/product/productCard'
import Button from '../../components/Button'

const Home = () => {
  const featuredProducts = Array(6).fill(0) // Placeholder products

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-wine-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-elegant font-bold mb-6">
            Timeless Elegance
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover our exclusive collection of handcrafted jewelry pieces that blend traditional craftsmanship with contemporary design.
          </p>
          <Button variant='primary' size='lg'>
            Shop Now
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-elegant font-bold text-center text-dark-900 dark:text-white mb-12">
          Featured Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((_, index) => (
            <ProductCard key={index} product={{}} />
          ))}
        </div>
      </section>
    </MainLayout>
  )
}

export default Home