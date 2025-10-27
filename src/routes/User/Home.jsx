import MainLayout from '../../layouts/MainLayout'
import ProductCard from '../../features/product/productCard'
import Button from '../../components/Button'
import { Link } from '@tanstack/react-router'
import hero from '../../assets/hero.png'


const Home = () => {
  const featuredProducts = Array(6).fill(0) // Placeholder products

  return (
    <MainLayout>
    <section className="h-screen relative  to-primary-200 text-dark-900 overflow-hidden">
      {/* Background Image */}
      <div className=" absolute inset-0 inset-x-0 bottom-0 pointer-events-non">
        <img
          src={hero}
          alt="Luxury Jewelry Background"
          className="w-full h-full object-cover opacity-65"
        />
      </div>

      {/* Bottom Geometric Pattern Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {/* Gold Circle (bottom-left) */}
          <div className="absolute bottom-0 left-0 w-72 h-72 border-4 border-primary-500 rounded-full -translate-x-1/3 translate-y-1/3"></div>

          {/* Wine Circle (bottom-right) */}
          <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-wine-500 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative container mx-auto flex flex-col items-center justify-center text-center pt-28 px-6">
        <h1 className="text-4xl md:text-7xl font-parisienne font-extrabold text-wine-500 dark:text-primary-500 mt-28 leading-tight ">
  Timeless Elegance, Handcrafted Luxury
</h1>


        <p className="text-lg md:text-xl text-dark-600 max-w-2xl mb-8">
          Discover jewelry that tells your story — crafted with passion,
          precision, and the finest materials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#shop"
            className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-wine-700 transition-colors duration-300 shadow-gold"
          >
            Shop Collection
          </a>

          <a
            href="#about"
            className="border border-wine-700 text-wine-700 font-semibold px-8 py-3 rounded-lg hover:bg-wine-700 hover:text-white transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
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