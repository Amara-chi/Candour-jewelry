import React, { useState } from 'react';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import axios from 'axios';
import { API_URL } from '../../config/api';

const Contact = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formValues.name.trim()) nextErrors.name = 'Name is required.';
    if (!formValues.email.trim()) nextErrors.email = 'Email is required.';
    if (!formValues.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!formValues.message.trim()) nextErrors.message = 'Message is required.';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    setStatus({ type: '', message: '' });

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/contact`, formValues);
      if (response.data?.success) {
        setStatus({ type: 'success', message: 'Thanks for reaching out! Our team will reply within 24 hours.' });
        setFormValues({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: response.data?.message || 'Unable to send your message right now.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Unable to send your message right now.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900">
      <SEOHead
        title="Contact Candour Jewelry"
        description="Connect with Candour Jewelry for bespoke requests, order support, and private appointments."
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-dark-800 dark:via-dark-900 dark:to-dark-900">
        <div className="absolute -top-20 right-0 h-60 w-60 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-900/20" />
        <div className="absolute -bottom-24 left-0 h-60 w-60 rounded-full bg-amber-100/60 blur-3xl dark:bg-amber-400/10" />
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 dark:text-primary-300 mb-3">
            Contact Candour
          </p>
          <h1 className="text-4xl md:text-5xl font-elegant font-bold text-dark-900 dark:text-white">
            Let’s craft something unforgettable together.
          </h1>
          <p className="mt-4 text-lg text-dark-600 dark:text-dark-300 max-w-2xl">
            Whether you need styling guidance, bespoke work, or order support, our concierge team is ready to help.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Concierge Line',
            detail: '+1 (800) 338-8939',
            note: 'Mon–Sat, 9am–6pm'
          },
          {
            title: 'Email Us',
            detail: 'info@candourjewelry.com',
            note: 'We reply within 24 hours'
          },
          {
            title: 'Atelier Visit',
            detail: '123 Luxury Lane, New York',
            note: 'Private appointments available'
          }
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-dark-100 dark:border-dark-700 bg-white dark:bg-dark-800 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-base font-medium text-primary-600 dark:text-primary-400">
              {item.detail}
            </p>
            <p className="text-sm text-dark-600 dark:text-dark-300 mt-2">
              {item.note}
            </p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-dark-100 dark:border-dark-700 bg-white dark:bg-dark-800 p-8 shadow-lg">
          <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white mb-2">
            Send a message
          </h2>
          <p className="text-sm text-dark-600 dark:text-dark-300 mb-6">
            Share your ideas, timelines, or order details. We’ll reply with tailored guidance.
          </p>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 px-4 py-3 text-sm text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
                {errors.name && <p className="mt-2 text-xs text-wine-500">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 px-4 py-3 text-sm text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
                {errors.email && <p className="mt-2 text-xs text-wine-500">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Custom ring, order support, appointment request..."
                value={formValues.subject}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 px-4 py-3 text-sm text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
              />
              {errors.subject && <p className="mt-2 text-xs text-wine-500">{errors.subject}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">
                Message
              </label>
              <textarea
                rows="5"
                name="message"
                placeholder="Tell us about your vision..."
                value={formValues.message}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 px-4 py-3 text-sm text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
              />
              {errors.message && <p className="mt-2 text-xs text-wine-500">{errors.message}</p>}
            </div>
            {status.message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  status.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-wine-200 bg-wine-50 text-wine-700'
                }`}
              >
                {status.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-dark-500 dark:text-dark-400">
                By submitting, you agree to receive communication from Candour Jewelry.
              </p>
              <Button variant="primary" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-dark-100 dark:border-dark-700 bg-primary-50/60 dark:bg-dark-800 p-8 shadow-lg">
          <h3 className="text-xl font-elegant font-bold text-dark-900 dark:text-white mb-4">
            Visit the atelier
          </h3>
          <p className="text-sm text-dark-600 dark:text-dark-300 mb-6">
            Experience our craftsmanship in person. Schedule a private appointment or walk in during open hours.
          </p>
          <div className="space-y-4 text-sm text-dark-600 dark:text-dark-300">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">Hours</p>
              <p className="mt-1">Monday – Saturday: 9:00am – 6:00pm</p>
              <p>Sunday: By appointment only</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">Appointments</p>
              <p className="mt-1">Book a private consultation to explore bespoke designs or upgrades.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dark-500 dark:text-dark-400">Need immediate help?</p>
              <p className="mt-1">Call our concierge line and we’ll respond within minutes during business hours.</p>
            </div>
          </div>
          <div className="mt-8">
            <Button variant="outline" size="lg">
              Book an Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
