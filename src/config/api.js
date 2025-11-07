const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname.includes('vercel.app');

    if (isProduction) {
      return '/api';
    }

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }

  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();