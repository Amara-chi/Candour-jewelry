// Environment-based API configuration for Vercel monorepo
const getApiUrl = () => {
  // For production on Vercel - use relative path since backend is in same project
  if (import.meta.env.PROD) {
    return '/api'; // Relative path - Vercel will route to your backend
  }
  // For development
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

// Debug info
console.log('🔧 API Configuration:');
console.log(' - Environment:', import.meta.env.MODE);
console.log(' - API URL:', API_URL);
console.log(' - VITE_API_URL env:', import.meta.env.VITE_API_URL);