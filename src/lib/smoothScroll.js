// Enhanced smooth scrolling utility
export const smoothScrollTo = (elementId, offset = 0, duration = 800) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + startPosition - offset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startPosition + distance * easeOutCubic);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// Smooth scroll to top
export const scrollToTop = (duration = 600) => {
  const startPosition = window.pageYOffset;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startPosition * (1 - easeOutCubic));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// Intersection Observer for section animations
export const createSectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '-10% 0px -10% 0px',
    threshold: [0.1, 0.3, 0.5, 0.7]
  };

  const observerOptions = { ...defaultOptions, ...options };

  return new IntersectionObserver(callback, observerOptions);
};

// Add smooth scroll behavior to all internal links
export const initializeSmoothScrolling = () => {
  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      smoothScrollTo(targetId, 80); // 80px offset for fixed header
    });
  });

  // Add scroll padding for better section visibility
  document.documentElement.style.scrollPaddingTop = '5rem';
};

// Debounce scroll events for better performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
