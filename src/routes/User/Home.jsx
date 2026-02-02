import React, { useEffect, useMemo, useRef, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../features/product/productCard';
import Button from '../../components/Button';
import { Link } from '@tanstack/react-router';
import Footer from '../../components/Footer';
import hero from '../../../src/assets/hero.png';
import candour from '../../assets/candour.png';
import { SEOHead } from '../../components/SEOHead';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';

const Home = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts({
    limit: 6,
    status: 'active',
    sort: '-createdAt'
  });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const featuredScrollRef = useRef(null);
  const socialScrollRef = useRef(null);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  const testimonials = [
    {
      quote:
        "The craftsmanship is exceptional! My wife couldn't stop smiling when she saw the necklace. The quality surpassed my expectations.",
      name: 'Adebola Johnson',
      city: 'Lagos',
      initial: 'A'
    },
    {
      quote:
        "I've purchased multiple pieces for special occasions. Each piece tells a story and the attention to detail is remarkable. Highly recommended!",
      name: 'Chiamaka Okoro',
      city: 'Abuja',
      initial: 'C'
    },
    {
      quote:
        "The engagement ring was absolutely stunning! The customer service was impeccable and helped me choose the perfect piece for my fiancée.",
      name: 'Oluwaseun Adebayo',
      city: 'Port Harcourt',
      initial: 'O'
    },
    {
      quote:
        "As someone who values quality, I was impressed by the durability of my gold bracelet. It still looks new after months of daily wear.",
      name: 'Ngozi Eze',
      city: 'Enugu',
      initial: 'N'
    },
    {
      quote:
        "The custom piece they created for our anniversary was breathtaking. They captured exactly what I envisioned and delivered on time.",
      name: 'Kunle Bello',
      city: 'Ibadan',
      initial: 'K'
    },
    {
      quote:
        "I purchased earrings for my mother's birthday and she loved them! The packaging was elegant and the entire experience was seamless.",
      name: 'Fatima Yusuf',
      city: 'Kano',
      initial: 'F'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollCarousel = (ref, direction = 1) => {
    if (!ref.current) return;
    const scrollAmount = ref.current.clientWidth * 0.85;
    ref.current.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  };

  return (
    <>
    <SEOHead 
      title="Premium Handcrafted Jewelry | Candour Jewelry"
      description="Discover exquisite handcrafted jewelry with timeless elegance. Premium gold, diamond, and luxury pieces for every occasion."
      keywords="handcrafted jewelry, gold jewelry, diamond rings, luxury jewelry, engagement rings, necklaces, earrings"
      type="website"
    />
    <MainLayout>
    <section className="h-screen relative to-primary-200 text-dark-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 inset-x-0 bottom-0 pointer-events-none">
        <img
          src={hero}
          alt="Luxury Jewelry Background"
          className="w-full h-full object-cover opacity-65"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 via-dark-900/30 to-transparent"></div>

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
      <div className="relative container mx-auto flex flex-col items-start justify-center text-left h-full px-6 sm:px-10">
        <div className="inline-flex items-center gap-3 rounded-full border border-primary-200/40 bg-dark-900/40 px-4 py-2 text-xs uppercase tracking-[0.35em] text-primary-200">
          Candour Atelier
          <span className="h-1 w-10 rounded-full bg-primary-400"></span>
        </div>
        <h1 className="mt-6 text-4xl md:text-7xl font-elegant font-semibold text-white leading-tight">
          Timeless Elegance,
          <span className="block text-primary-300 font-parisienne text-5xl md:text-7xl">
            Handcrafted Luxury
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-white/80 font-medium mt-4 max-w-2xl mb-10">
          Discover jewelry that tells your story—crafted with passion, precision, and the finest materials.
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
            variant="outline"
            size="lg"
          >
            <Link to="/about">Meet the Atelier</Link>
          </Button>
        </div>
        <div className="mt-10 flex items-center gap-6 text-sm text-white/70">
          <div className="flex flex-col">
            <span className="text-primary-200 uppercase tracking-[0.3em]">Since</span>
            <span className="text-lg text-white">2016</span>
          </div>
          <div className="h-10 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-primary-200 uppercase tracking-[0.3em]">Pieces</span>
            <span className="text-lg text-white">120+</span>
          </div>
          <div className="h-10 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-primary-200 uppercase tracking-[0.3em]">Custom</span>
            <span className="text-lg text-white">Yes</span>
          </div>
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

<section className="py-20 bg-gradient-to-b from-white via-primary-50/60 to-wine-50/40 dark:from-dark-800 dark:via-dark-700 dark:to-dark-800">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col items-center text-center mb-12">
      <p className="text-sm uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300 mb-3">
        Curated For You
      </p>
      <h2 className="text-3xl md:text-4xl font-elegant font-bold text-dark-900 dark:text-white">
        Shop By Category
      </h2>
      <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
        From everyday essentials to statement pieces, explore collections designed to elevate every moment.
      </p>
    </div>

    {categoriesLoading ? (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    ) : categories.length === 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((label) => (
          <div
            key={label}
            className="group relative h-full overflow-hidden rounded-2xl border border-primary-100/60 dark:border-dark-600 bg-white/80 dark:bg-dark-700/80 shadow-sm"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 via-white to-wine-100 dark:from-dark-600 dark:via-dark-700 dark:to-dark-500 flex items-center justify-center">
              <span className="text-4xl">💎</span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{label}</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2">
                Curated edits arriving soon.
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.slice(0, 8).map((category) => (
          <Link key={category._id} to={`/shop?category=${category._id}`}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-primary-100/60 dark:border-dark-600 bg-white/80 dark:bg-dark-700/80 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/5] overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary-100 to-wine-100 dark:from-dark-600 dark:to-dark-500">
                    {category.icon || '💎'}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-wine-500 dark:text-wine-300 mb-3">
            Signature Pieces
          </p>
          <h2 className="text-3xl md:text-4xl font-elegant font-bold text-dark-900 dark:text-white">
            Featured Collection
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            A refined selection of our most coveted designs, chosen for their artistry and allure.
          </p>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Golden Halo Ring', 'Lumière Pendant', 'Eternal Cuff'].map((name) => (
              <div
                key={name}
                className="rounded-3xl border border-primary-100/60 dark:border-dark-600 bg-white/80 dark:bg-dark-700/80 p-6 shadow-sm"
              >
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary-100 via-white to-wine-100 dark:from-dark-600 dark:via-dark-700 dark:to-dark-500 mb-6"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300">Signature</p>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{name}</h3>
                  </div>
                  <span className="text-sm text-dark-500 dark:text-dark-300">Preview</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 hidden -translate-y-1/2 lg:flex">
              <button
                type="button"
                onClick={() => scrollCarousel(featuredScrollRef, -1)}
                className="h-12 w-12 rounded-full border border-primary-200 bg-white/80 text-primary-600 shadow-lg backdrop-blur hover:-translate-y-1 transition-all"
              >
                ←
              </button>
            </div>
            <div
              ref={featuredScrollRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            >
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] snap-start"
                >
                  <ProductCard
                    product={product}
                    priority={index < 3}
                  />
                </div>
              ))}
            </div>
            <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:flex">
              <button
                type="button"
                onClick={() => scrollCarousel(featuredScrollRef, 1)}
                className="h-12 w-12 rounded-full border border-primary-200 bg-white/80 text-primary-600 shadow-lg backdrop-blur hover:-translate-y-1 transition-all"
              >
                →
              </button>
            </div>
          </div>
        )}
        <div className="mt-12 flex justify-center">
          <Button variant="primaryreverse" size="lg">
            <Link to="/shop">Explore the full collection</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-primary-50/60 via-white to-wine-50/40 dark:from-dark-800 dark:via-dark-700 dark:to-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300 mb-3">
              Client Love
            </p>
            <h2 className="text-3xl md:text-4xl font-elegant font-bold text-dark-900 dark:text-white">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              A few words from clients who chose Candour for their most meaningful moments.
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className={`transition-all duration-700 ${
                    index === activeTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none h-0'
                  }`}
                >
                  <div className="mx-auto max-w-3xl bg-white/90 dark:bg-dark-600/90 backdrop-blur border border-primary-200/60 dark:border-dark-500 rounded-3xl p-8 md:p-10 shadow-xl">
                    <div className="flex items-center justify-between mb-6 text-sm text-primary-500 dark:text-primary-300">
                      <span className="tracking-[0.35em]">★★★★★</span>
                      <span className="text-xs uppercase text-dark-500 dark:text-dark-300">Verified</span>
                    </div>
                    <p className="text-lg md:text-xl text-dark-700 dark:text-gray-200 leading-relaxed mb-8">
                      “{testimonial.quote}”
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4 bg-gradient-to-br from-primary-500 to-wine-500">
                        {testimonial.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2.5 w-8 rounded-full transition-all ${
                      index === activeTestimonial ? 'bg-primary-500 w-10' : 'bg-primary-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="px-6 py-2 rounded-full border border-primary-200 text-primary-600 bg-white/80 hover:-translate-y-1 transition-all"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="px-6 py-2 rounded-full border border-primary-200 text-primary-600 bg-white/80 hover:-translate-y-1 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="py-20">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          icon: '🔒',
          title: 'Secure Shipping',
          desc: 'Insured delivery with discreet, luxury packaging.',
          back: 'Tracked, insured, and styled to delight from unboxing to wear.'
        },
        {
          icon: '💎',
          title: 'Lifetime Warranty',
          desc: 'Guaranteed quality, craftsmanship, and aftercare.',
          back: 'Complimentary cleaning and lifetime care guidance.'
        },
        {
          icon: '❤️',
          title: 'Ethically Sourced',
          desc: 'Conflict-free diamonds and responsibly sourced gems.',
          back: 'We partner with trusted suppliers who value transparency.'
        }
      ].map((item, index) => (
        <div key={index} className="flip-card h-full">
          <div className="flip-card-inner h-full">
            <div className="flip-card-front rounded-2xl border border-primary-100/60 dark:border-dark-600 bg-white dark:bg-dark-700 p-8 shadow-sm">
              <div className="text-4xl mb-5">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-dark-900 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
            <div className="flip-card-back rounded-2xl border border-primary-200/60 dark:border-dark-600 bg-gradient-to-br from-primary-500 via-wine-500 to-primary-400 p-8 text-white shadow-xl">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-white/90">{item.back}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="py-20 bg-gradient-to-b from-white via-primary-50/40 to-wine-50/40 dark:from-dark-800 dark:to-dark-700">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col items-center text-center mb-12">
      <p className="text-sm uppercase tracking-[0.3em] text-wine-500 dark:text-wine-300 mb-3">
        Social Atelier
      </p>
      <h2 className="text-3xl md:text-4xl font-elegant font-bold text-dark-900 dark:text-white mb-4">
        Follow Our Story
      </h2>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
        Inspired by @candours_jewels—soft light, rich tones, and the sparkle of everyday luxury.
      </p>
    </div>
    <div className="relative">
      <div
        ref={socialScrollRef}
        className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
      >
        {[
          {
            title: 'Behind-the-scenes polishing',
            caption: 'A closer look at artisan finishing touches.'
          },
          {
            title: 'New arrivals & sparkles',
            caption: 'Fresh drops styled like the Instagram feed.'
          },
          {
            title: 'Custom design moments',
            caption: 'From sketch to sparkle, your story in gold.'
          },
          {
            title: 'Elegant gifting ideas',
            caption: 'Wrapped with intention for every celebration.'
          },
          {
            title: 'Statement earrings',
            caption: 'Bold silhouettes with refined detail.'
          }
        ].map((card) => (
          <div
            key={card.title}
            className="group relative min-w-[240px] sm:min-w-[280px] md:min-w-[320px] aspect-[4/5] snap-start rounded-2xl overflow-hidden border border-primary-100/60 dark:border-dark-500 shadow-lg transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-wine-100 dark:from-dark-700 dark:via-dark-600 dark:to-dark-500"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10"></div>
            <div className="relative z-10 h-full w-full flex flex-col justify-end p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-dark-700 dark:text-dark-200 mb-2">Candour</p>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">{card.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollCarousel(socialScrollRef, -1)}
          className="px-6 py-2 rounded-full border border-primary-200 text-primary-600 bg-white/80 hover:-translate-y-1 transition-all"
        >
          ← Swipe Back
        </button>
        <button
          type="button"
          onClick={() => scrollCarousel(socialScrollRef, 1)}
          className="px-6 py-2 rounded-full border border-primary-200 text-primary-600 bg-white/80 hover:-translate-y-1 transition-all"
        >
          Swipe Forward →
        </button>
      </div>
    </div>
    <div className="mt-10 flex justify-center">
      <Button variant="outline">
        <a
          href="https://www.instagram.com/candours_jewels/?hl=en"
          target="_blank"
          rel="noreferrer"
        >
          Discover more on Instagram
        </a>
      </Button>
    </div>
  </div>
</section>
    </MainLayout>
    </>
  )
}

export default Home
