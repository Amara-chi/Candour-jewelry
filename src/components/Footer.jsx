import React from 'react';
import { Helmet } from 'react-helmet';

const Footer = () => {
  const organizationSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: "Candour's Jewelry",
    url: 'https://candour-jewelry.vercel.app',
    logo: 'https://candour-jewelry.vercel.app/logo.png',
    description: 'Premium handcrafted jewelry with timeless elegance. Discover luxury gold, diamond, and engagement rings.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Luxury Lane',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+1-800-JEWELRY',
      email: 'info@candourjewelry.com'
    },
    sameAs: [
      'https://www.instagram.com/candourjewelry',
      'https://www.facebook.com/candourjewelry',
      'https://twitter.com/candourjewelry'
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>
      <footer className="bg-gray-100 dark:bg-dark-900 border-t-primary-500 dark:border-t-dark-500 border-t-[1px] text-gray-800 dark:text-gray-100 py-8 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">CJ</span>
          </div>
          <span className="text-xl font-elegant font-bold">Candour Jewelry</span>
        </div>

        <p className="text-gray-500 dark:text-gray-300 mb-2">
          Crafted with elegance and precision
        </p>

        <p className="text-gray-400 dark:text-gray-500 text-sm">
          &copy; 2024 Candour Jewelry. All rights reserved.
        </p>

        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Terms</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Privacy</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Contact</a>
        </div>

        {/* Business Contact Info for SEO */}
        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-dark-700 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            📧 Email: <a href="mailto:info@candourjewelry.com" className="hover:text-primary-500">info@candourjewelry.com</a>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            📞 Phone: <a href="tel:+18003385939" className="hover:text-primary-500">+1-800-JEWELRY</a>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            📍 Location: 123 Luxury Lane, New York, NY 10001
          </p>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;
