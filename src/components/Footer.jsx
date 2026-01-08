import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from '@tanstack/react-router';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '#' }
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Return Policy', href: '#' },
    { label: 'Shipping Info', href: '#' }
  ];

  const customerService = [
    { label: 'Help Center', href: '#' },
    { label: 'Track Order', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Contact Us', href: '#' }
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/candourjewelry', icon: '📷' },
    { name: 'Facebook', url: 'https://facebook.com/candourjewelry', icon: '👍' },
    { name: 'Twitter', url: 'https://twitter.com/candourjewelry', icon: '𝕏' },
    { name: 'Pinterest', url: 'https://pinterest.com/candourjewelry', icon: '📌' }
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <footer className="bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-700 text-gray-800 dark:text-gray-100 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">CJ</span>
                </div>
                <span className="text-lg font-elegant font-bold text-dark-900 dark:text-white">
                  Candour Jewelry
                </span>
              </div>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                Handcrafted jewelry with timeless elegance. Crafted with passion, precision, and the finest materials.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-10 h-10 rounded-full bg-dark-100 dark:bg-dark-700 flex items-center justify-center text-lg hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
                Customer Service
              </h4>
              <ul className="space-y-2">
                {customerService.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:info@candourjewelry.com"
                    className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-2"
                  >
                    <span>📧</span> info@candourjewelry.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+18003388939"
                    className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-2"
                  >
                    <span>📞</span> +1-800-JEWELRY
                  </a>
                </li>
                <li className="text-sm text-dark-600 dark:text-dark-400 flex items-start gap-2">
                  <span>📍</span> 123 Luxury Lane, New York, NY 10001
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-200 dark:border-dark-700 pt-8">
            <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
              <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                Get exclusive updates on new collections, special offers, and jewelry care tips.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-dark-600 dark:text-dark-400">
                &copy; {currentYear} Candour Jewelry. All rights reserved.
              </p>
              <div className="flex gap-4 text-xs text-dark-600 dark:text-dark-400">
                <a href="#" className="hover:text-primary-500 transition-colors">Payment Methods</a>
                <span className="text-dark-400">•</span>
                <a href="#" className="hover:text-primary-500 transition-colors">Accessibility</a>
                <span className="text-dark-400">•</span>
                <a href="#" className="hover:text-primary-500 transition-colors">Site Map</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
