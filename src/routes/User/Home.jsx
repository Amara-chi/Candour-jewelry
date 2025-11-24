import MainLayout from '../../layouts/MainLayout'
import ProductCard from '../../features/product/productCard'
import Button from '../../components/Button'
import { Link } from '@tanstack/react-router'
import Footer from '../../components/Footer'
import hero from '../../../src/assets/hero.png'
import candour from '../../assets/candour.png'

const Home = () => {
  const featuredProducts = Array(6).fill(0) // Placeholder products

  return (
    <>
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
      <div className="relative container mx-auto flex flex-col items-center justify-center text-center h-full px-4">
        <h1 className="text-4xl md:text-7xl font-parisienne font-extrabold text-wine-500 dark:text-primary-500 leading-tight ">
          Timeless Elegance, Handcrafted Luxury
        </h1>


        <p className="text-lg md:text-xl dark:text-white text-gray-800 font-semibold mt-3 max-w-2xl mb-8">
          Discover jewelry that tells your story; crafted with passion,
          precision, and the finest materials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primaryreverse"
            size="lg"
            onClick={() => {}}
          >
            <Link to="/shop">Shop Collection</Link>
          </Button>

          <Button
            variant='secondaryreverse'
            size='lg'
          >
            <Link to="">Learn More</Link>
          </Button>

        </div>
      </div>
    </section>
  
    <section className="bg-white dark:bg-dark-800 py-16">
  <div className="max-w-7xl mx-auto px-4">
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-6">
          The face behind the brand
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          For over eight years, I have poured my heart and soul into creating exquisite jewelry pieces that embody elegance and craftsmanship. Each piece is a testament to my dedication to quality and my passion for design. 
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          At Candour's Jewelry, we believe that jewelry is more than just an accessory; it's a reflection of your unique story and style. From intricate necklaces to timeless rings, every creation is meticulously crafted to perfection. Join me on this journey of beauty and craftsmanship, and let us help you find the perfect piece that resonates with your soul. 
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Our specialty is crafting customized pieces that tell your story. Let's create something beautiful together.
        </p>
        <Button variant="outline">
          <Link to="/about">Order a Customised Piece</Link>
        </Button>
      </div>
      <div className="relative h-80 md:h-96 lg:h-full rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-primary-100 to-wine-100 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center">
        <img src={candour} alt="" />
      </div>
      
      {/* Bottom Geometric Pattern Overlay */}
      <div className="absolute inset-x-0 h-[100%] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-25 z-10">
          {/* Gold Circle (bottom-left) */}
          <div className="absolute bottom- left-0 w-72 h-72 border-4 border-primary-300 rounded-full -translate-x-1/3 translate-y-1/3"></div>

          {/* Wine Circle (bottom-right) */}
          <div className="absolute bottom- right-0 w-96 h-96 border-4 border-wine-500 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="absolute bottom-4/4 left-2/4 w-20 h-20 border border-wine-600 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 border border-primary-600 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 border border-primary-600 rounded-full"></div>
        </div>
      </div>

    </div>
  </div>
</section>

<section className="py-16 bg-gray-300 dark:bg-dark-700">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-elegant font-bold text-center text-dark-900 dark:text-white mb-12">
      Shop By Category
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((category) => (
        <Link key={category} to={`/shop?category=${category.toLowerCase()}`}>
          <div className="group cursor-pointer">
            <div className="aspect-square bg-white dark:bg-dark-600 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              {/* Category image */}
            </div>
            <h3 className="text-center mt-4 font-semibold text-dark-900 dark:text-white">
              {category}
            </h3>
          </div>
        </Link>
      ))}
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

      <section className="py-16 bg-gray-50 dark:bg-dark-700">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-elegant font-bold text-center text-dark-900 dark:text-white mb-12">
      What Our Customers Say
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Testimonial 1 */}
      <div className="bg-white dark:bg-dark-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          ⭐⭐⭐⭐⭐
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "The craftsmanship is exceptional! My wife couldn't stop smiling when she saw the necklace. The quality surpassed my expectations."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            A
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">Adebola Johnson</p>
            <p className="text-sm text-gray-500">Lagos</p>
          </div>
        </div>
      </div>

      {/* Testimonial 2 */}
      <div className="bg-white dark:bg-dark-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          ⭐⭐⭐⭐⭐
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "I've purchased multiple pieces for special occasions. Each piece tells a story and the attention to detail is remarkable. Highly recommended!"
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-wine-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            C
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">Chiamaka Okoro</p>
            <p className="text-sm text-gray-500">Abuja</p>
          </div>
        </div>
      </div>

      {/* Testimonial 3 */}
      <div className="bg-white dark:bg-dark-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          ⭐⭐⭐⭐⭐
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "The engagement ring was absolutely stunning! The customer service was impeccable and helped me choose the perfect piece for my fiancée."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            O
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">Oluwaseun Adebayo</p>
            <p className="text-sm text-gray-500">Port Harcourt</p>
          </div>
        </div>
      </div>

      {/* Testimonial 4 */}
      <div className="bg-white dark:bg-dark-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          ⭐⭐⭐⭐⭐
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "As someone who values quality, I was impressed by the durability of my gold bracelet. It still looks new after months of daily wear."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-wine-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            N
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">Ngozi Eze</p>
            <p className="text-sm text-gray-500">Enugu</p>
          </div>
        </div>
      </div>

      {/* Testimonial 5 */}
      <div className="bg-white dark:bg-dark-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          ⭐⭐⭐⭐⭐
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "The custom piece they created for our anniversary was breathtaking. They captured exactly what I envisioned and delivered on time."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            K
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">Kunle Bello</p>
            <p className="text-sm text-gray-500">Ibadan</p>
          </div>
        </div>
      </div>

      {/* Testimonial 6 */}
      <div className="bg-white dark:bg-dark-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          ⭐⭐⭐⭐⭐
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "I purchased earrings for my mother's birthday and she loved them! The packaging was elegant and the entire experience was seamless."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-wine-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            F
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">Fatima Yusuf</p>
            <p className="text-sm text-gray-500">Kano</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="py-16">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {[
        { icon: '🔒', title: 'Secure Shipping', desc: 'Free insured delivery worldwide' },
        { icon: '💎', title: 'Lifetime Warranty', desc: 'Guaranteed quality & craftsmanship' },
        { icon: '❤️', title: 'Ethically Sourced', desc: 'Conflict-free diamonds & gems' }
      ].map((item, index) => (
        <div key={index} className="p-6">
          <div className="text-4xl mb-4">{item.icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-dark-900 dark:text-white">{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="py-16">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-elegant font-bold text-center text-dark-900 dark:text-white mb-8">
      Follow Our Story
    </h2>
    <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
      Join our community of jewelry lovers and see how our pieces become part of your story
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Instagram feed images */}
    </div>
  </div>
</section>
    </MainLayout>
    </>
  )
}

export default Home