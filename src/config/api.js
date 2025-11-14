const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const isVercelProduction = window.location.hostname.includes('vercel.app');
    
    if (isVercelProduction) {
      console.log('🚀 Production: Using relative API path');
      return '/api'; 
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

export const API_URL = '/api';

console.log('🚀 API Configuration:');
console.log(' - API URL:', API_URL);
console.log(' - Environment:', import.meta.env.MODE);
console.log(' - Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');