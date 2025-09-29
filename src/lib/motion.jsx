import React, { useEffect, useState } from 'react';
import { LazyMotion, MotionConfig, m, useReducedMotion } from 'framer-motion';

// Lazy-load framer-motion features for code-splitting
const loadFeatures = () => import('framer-motion').then((mod) => mod.domAnimation);

export function MotionProvider({ children }) {
  // Respect user setting globally
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

// Hook: if user prefers reduced motion AND viewport is small, disable reveal animations
export function useReducedOnSmall() {
  const prefers = useReducedMotion();
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handler = () => setIsSmall(mq.matches);
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return Boolean(prefers && isSmall);
}

// Variants: fade + slide-up, transform + opacity only for GPU acceleration
export const fadeSlideUp = {
  hidden: { opacity: 0, y: 24, willChange: 'transform, opacity' },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 1.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Variants: fade + slide from left/right for two-column reveal patterns
export const fadeSlideLeft = {
  hidden: { opacity: 0, x: -120, willChange: 'transform, opacity' },
  visible: (d = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: d, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const fadeSlideRight = {
  hidden: { opacity: 0, x: 120, willChange: 'transform, opacity' },
  visible: (d = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: d, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Container stagger with no transform to avoid nested transform jank
export const containerStagger = (stagger = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

// Convenience components
export function MotionSection({ children, delay = 0.3, className = '', as: As = m.section, ...rest }) {
  const reduce = useReducedOnSmall();
  if (reduce) {
    // Render without motion for reduced-motion on small screens
    const Plain = 'section';
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }
  return (
    <As
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeSlideUp}
      custom={delay}
      {...rest}
    >
      {children}
    </As>
  );
}

export function MotionHeading({ children, delay = 0.6, level = 2, className = '', ...rest }) {
  const reduce = useReducedOnSmall();
  const Tag = `h${level}`;
  if (reduce) return <Tag className={className} {...rest}>{children}</Tag>;
  const As = m[Tag] ?? m.h2;
  return (
    <As
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={fadeSlideUp}
      custom={delay}
      {...rest}
    >
      {children}
    </As>
  );
}

