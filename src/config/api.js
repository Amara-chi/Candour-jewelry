// Smart API configuration for Vercel monorepo
const getApiUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const isVercelProduction = window.location.hostname.includes('vercel.app');
    
    if (isVercelProduction) {
      console.log('🚀 Production: Using relative API path');
      return '/api'; // Relative path for Vercel monorepo
    }
    
    // Development - use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('💻 Development: Using localhost API');
      return 'http://localhost:5000/api';
    }
  }
  
  // Fallback
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

console.log('🔧 Final API Configuration:');
console.log(' - API URL:', API_URL);
console.log(' - Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
console.log(' - PROD mode:', import.meta.env.PROD);