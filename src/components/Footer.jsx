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
    { label: 'Contact', href: '/contact' }
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
    { label: 'Contact Us', href: '/contact' }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/candourjewelry',
      viewBox: '0 0 24 24',
      path: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 4h.01M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/candourjewelry',
      viewBox: '0 0 24 24',
      path: 'M15 3h-2a5 5 0 0 0-5 5v3H6v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3V3z'
    },
    {
      name: 'X',
      url: 'https://twitter.com/candourjewelry',
      viewBox: '0 0 24 24',
      path: 'M4 4l7.5 8.5L4 20h3.5l5-5.5L17 20h3l-7.7-8.9L20 4h-3.5l-4.4 4.9L8 4z'
    },
    {
      name: 'Pinterest',
      url: 'https://pinterest.com/candourjewelry',
      viewBox: '0 0 24 24',
      path: 'M12 3a8 8 0 0 0-2.8 15.5l1-4A3.7 3.7 0 0 1 9 12a3 3 0 0 1 6-.6c.4 2.2-1.2 4.3-3.5 4.3-1 0-2-.5-2.4-1.3l-1.2 4.8A8 8 0 1 0 12 3z'
    }
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <footer className="relative bg-gradient-to-b from-white via-white to-primary-50/40 dark:from-dark-950 dark:via-dark-950 dark:to-dark-900 border-t border-dark-200 dark:border-dark-700 text-gray-800 dark:text-white mt-20 transition-colors duration-300 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-100/60 via-transparent to-transparent dark:from-primary-900/20" />
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl border border-dark-200/80 dark:border-dark-700/80 bg-white/90 dark:bg-dark-900/90 shadow-[0_30px_80px_-40px_rgba(8,8,23,0.35)] backdrop-blur">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary-200/60 blur-3xl dark:bg-primary-700/20" />
              <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-500/10" />
              <div className="relative grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:border-primary-700/50 dark:bg-primary-900/40 dark:text-primary-200">
                    Candour Atelier
                  </span>
                  <h4 className="mt-4 text-2xl md:text-3xl font-elegant font-bold text-dark-900 dark:text-white">
                    Receive private access to new collections and bespoke offers.
                  </h4>
                  <p className="mt-3 text-sm md:text-base text-dark-700 dark:text-white/80">
                    Join our inner circle for early previews, gemstone stories, and appointments crafted just for you.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-dark-600 dark:text-white/70">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary-500" />
                      Ethical sourcing
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary-500" />
                      Concierge service
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary-500" />
                      Exclusive previews
                    </span>
                  </div>
                </div>
                <div>
                  <form className="flex flex-col gap-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-dark-600 dark:text-white/70">
                      Email Address
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="flex-1 rounded-full border border-dark-200/80 bg-white px-5 py-3 text-sm text-dark-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-dark-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-primary-600 dark:bg-primary-500 dark:text-dark-950 dark:hover:bg-primary-400"
                      >
                        Join Now
                      </button>
                    </div>
                    <p className="text-xs text-dark-600 dark:text-white/70">
                      By subscribing, you agree to receive emails from Candour Jewelry. Unsubscribe anytime.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>

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
              <p className="text-sm text-dark-700 dark:text-white/80 mb-4">
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
                    className="w-11 h-11 rounded-full border border-dark-200/80 dark:border-dark-700/80 bg-white/80 dark:bg-dark-900/70 flex items-center justify-center text-dark-600 dark:text-white/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-primary-600 hover:text-white dark:hover:border-primary-400/70 dark:hover:bg-primary-500"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox={social.viewBox}
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={social.path} />
                    </svg>
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
                        className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
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
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
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
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
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
                    className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors flex items-center gap-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dark-200/80 bg-white/80 text-dark-600 dark:border-dark-700 dark:bg-dark-900/80 dark:text-white/70">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 6h16v12H4z" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </span>
                    info@candourjewelry.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+18003388939"
                    className="text-sm text-dark-700 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-300 transition-colors flex items-center gap-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dark-200/80 bg-white/80 text-dark-600 dark:border-dark-700 dark:bg-dark-900/80 dark:text-white/70">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 6.5c4 7.5 5.9 9.4 13 13l2-2a2 2 0 0 0 0-2.8l-2-2a2 2 0 0 0-2.8 0l-1.1 1.1a12.3 12.3 0 0 1-5.2-5.2L9 7.5a2 2 0 0 0 0-2.8l-2-2a2 2 0 0 0-2.8 0l-1.2 1.2a2 2 0 0 0 0 2.6z" />
                      </svg>
                    </span>
                    +1-800-JEWELRY
                  </a>
                </li>
                <li className="text-sm text-dark-700 dark:text-white/80 flex items-start gap-2">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-dark-200/80 bg-white/80 text-dark-600 dark:border-dark-700 dark:bg-dark-900/80 dark:text-white/70">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  123 Luxury Lane, New York, NY 10001
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-200 dark:border-dark-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-dark-700 dark:text-white/80">
                &copy; {currentYear} Candour Jewelry. All rights reserved.
              </p>
              <div className="flex gap-4 text-xs text-dark-600 dark:text-white/70">
                <a href="#" className="hover:text-primary-500 dark:hover:text-primary-300 transition-colors">Payment Methods</a>
                <span className="text-dark-400 dark:text-white/60">•</span>
                <a href="#" className="hover:text-primary-500 dark:hover:text-primary-300 transition-colors">Accessibility</a>
                <span className="text-dark-400 dark:text-white/60">•</span>
                <a href="#" className="hover:text-primary-500 dark:hover:text-primary-300 transition-colors">Site Map</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
