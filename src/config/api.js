const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const isVercelProduction = window.location.hostname.includes('vercel.app');
    
    if (isVercelProduction) {
      console.log('🚀 Production: Using relative API path');
      return '/api'; 
    }
    
    // Development - use localhost or proxy
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('💻 Development: Using localhost API');
      return 'http://localhost:5000/api';
    }
    
    // Replit environment - use proxy
    if (window.location.hostname.includes('replit') || window.location.hostname.includes('repl.co')) {
      console.log('🔧 Replit: Using proxy API');
      return '/api';
    }
  }
  
  // Fallback
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

console.log('🔧 Final API Configuration:');
console.log(' - API URL:', API_URL);
console.log(' - PROD mode:', import.meta.env.PROD);
console.log(' - Environment:', import.meta.env.MODE);
console.log(' - Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');