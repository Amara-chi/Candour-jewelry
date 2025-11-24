import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-dark-900 border-t-primary-500 dark:border-t-dark-500 border-t-[1px] text-gray-800 dark:text-gray-100 py-8 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">CJ</span>
          </div>
          <span className="text-xl font-elegant font-bold">Candour Jewelry</span>
        </div>

        <p className="text-gray-500 dark:text-gray-300 mb-2">
          Crafted with elegance and precision
        </p>

        <p className="text-gray-400 dark:text-gray-500 text-sm">
          &copy; 2024 Candour Jewelry. All rights reserved.
        </p>

        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Terms</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Privacy</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
