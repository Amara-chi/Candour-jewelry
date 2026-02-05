import React from 'react';
import { Link } from '@tanstack/react-router';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { SEOHead } from '../../components/SEOHead';

const About = () => {
  return (
    <MainLayout>
      <SEOHead
        title="About Candour Jewelry | Handcrafted Luxury"
        description="Learn about Candour Jewelry, our craftsmanship, and how we design bespoke pieces that celebrate your story."
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-dark-800 dark:via-dark-900 dark:to-dark-900">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-900/20" />
        <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl dark:bg-amber-400/10" />
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300 mb-3">
            Candour Atelier
          </p>
          <h1 className="text-4xl md:text-5xl font-elegant font-bold text-dark-900 dark:text-white">
            Crafting heirlooms with intention and precision.
          </h1>
          <p className="mt-4 text-lg text-dark-600 dark:text-dark-300 max-w-2xl">
            Every piece is designed to celebrate the milestones that matter most. We blend modern silhouettes
            with heritage techniques, using responsibly sourced materials and artisanal finishing.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-dark-100 dark:border-dark-700 bg-white dark:bg-dark-800 p-8 shadow-lg">
          <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white mb-4">
            Our Story
          </h2>
          <p className="text-dark-600 dark:text-dark-300 mb-4">
            Candour Jewelry began as a small studio focused on bespoke adornment. Today, we continue that legacy
            by combining hand-finished artistry with a concierge experience that honors every client’s vision.
          </p>
          <p className="text-dark-600 dark:text-dark-300">
            We believe in transparency, enduring quality, and design that feels personal—because the most
            memorable jewelry is the kind that tells your story.
          </p>
        </div>

        <div className="rounded-3xl border border-dark-100 dark:border-dark-700 bg-primary-50/60 dark:bg-dark-800 p-8 shadow-lg">
          <h3 className="text-xl font-elegant font-bold text-dark-900 dark:text-white mb-4">
            Bespoke Design Process
          </h3>
          <ol className="space-y-4 text-sm text-dark-600 dark:text-dark-300 list-decimal list-inside">
            <li>Initial consultation to capture your inspiration, budget, and timeline.</li>
            <li>Design sketches and stone selection curated for your approval.</li>
            <li>Handcrafting in our atelier with progress updates and quality checks.</li>
            <li>Final fitting, care guidance, and delivery in signature packaging.</li>
          </ol>
          <div className="mt-8">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Start a Custom Request
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
