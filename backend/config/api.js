// Environment-based API configuration
const getApiUrl = () => {
  // For production on Vercel
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://candour-jewelry.vercel.app/api';
  }
  // For development
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();