import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  onLoad, 
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '50px 0px',
  });

  useEffect(() => {
    if (inView && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={ref} className="relative">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
      
      {/* Blurred placeholder */}
      {!isLoaded && imageSrc && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse blur-sm" />
      )}
    </div>
  );
};