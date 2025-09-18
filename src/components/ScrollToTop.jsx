import React, { useState, useEffect } from 'react';
import { scrollToTop, debounce } from '../lib/smoothScroll';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const debouncedToggleVisibility = debounce(toggleVisibility, 16); // ~60fps

    window.addEventListener('scroll', debouncedToggleVisibility, { passive: true });

    return () => window.removeEventListener('scroll', debouncedToggleVisibility);
  }, []);

  const handleScrollToTop = () => {
    scrollToTop(800);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleScrollToTop}
      className="md:block hidden fixed bottom-[9rem] md:bottom-[8rem] right-4 z-50 w-12 h-12 bg-gradient-to-br from-accent to-primary text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/30"
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
