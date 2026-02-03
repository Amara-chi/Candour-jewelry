import React from 'react';

const Spinner = ({ size = 48, className = '', label = 'Loading' }) => (
  <span className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
    <span
      className="animate-spin rounded-full border-2 border-primary-500 border-t-transparent shadow-[0_0_12px_rgba(234,179,8,0.45)]"
      style={{ width: size, height: size }}
      aria-label={label}
    />
  </span>
);

export default Spinner;
