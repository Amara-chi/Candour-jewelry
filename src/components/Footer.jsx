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
    { label: 'Care Guide', href: '#' },
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
          <div className="grid gap-6 md:grid-cols-3 mb-14">
            {[
              {
                title: 'Private Appointments',
                description: 'Reserve a one-on-one styling session with our atelier specialists.',
              },
              {
                title: 'Lifetime Care',
                description: 'Complimentary inspections, cleanings, and stone security checks.',
              },
              {
                title: 'Gift Concierge',
                description: 'Personalized packaging and handwritten notes for every occasion.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-dark-200/80 dark:border-dark-700/80 bg-white/80 dark:bg-dark-900/70 p-6 shadow-[0_18px_45px_-30px_rgba(8,8,23,0.4)] backdrop-blur"
              >
                <h4 className="text-base font-semibold text-dark-900 dark:text-white">{item.title}</h4>
                <p className="mt-2 text-sm text-dark-700 dark:text-dark-300">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">CJ</span>
                </div>
                <span className="text-lg font-elegant font-bold text-dark-900 dark:text-white">
                  Candour Jewelry
                </span>
              </div>
              <p className="text-sm text-dark-700 dark:text-dark-300 mb-5">
                Crafted in New York with ethically sourced gemstones and a dedication to timeless elegance.
              </p>
              <form className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-dark-600 dark:text-dark-300">
                  Newsletter
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 rounded-full border border-dark-200/80 bg-white px-4 py-2.5 text-sm text-dark-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-dark-700 dark:bg-dark-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-dark-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-primary-600 dark:bg-primary-500 dark:text-dark-950 dark:hover:bg-primary-400"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-10 h-10 rounded-full border border-dark-200/80 dark:border-dark-700/80 bg-white/80 dark:bg-dark-900/70 flex items-center justify-center text-dark-600 dark:text-dark-300 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-primary-600 hover:text-white dark:hover:border-primary-400/70 dark:hover:bg-primary-500"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox={social.viewBox}
                      className="h-4 w-4"
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
                Discover
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
              <div className="mt-6 rounded-2xl border border-primary-200/70 bg-primary-50/70 p-4 text-xs text-primary-700 dark:border-primary-700/40 dark:bg-primary-900/30 dark:text-primary-200">
                <p className="font-semibold uppercase tracking-[0.2em]">Showroom</p>
                <p className="mt-2 text-sm font-medium text-dark-900 dark:text-white">
                  By appointment only • 10 AM - 7 PM
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
                Client Care
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
              <div className="flex gap-4 text-xs text-dark-600 dark:text-dark-300">
                {legalLinks.map((link) => (
                  <a key={link.label} href={link.href} className="hover:text-primary-500 transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
