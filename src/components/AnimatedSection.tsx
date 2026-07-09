import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
  staggerChildren?: number;
  id?: string;
  style?: React.CSSProperties;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  staggerChildren = 0,
  id,
  style,
}) => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const mobileOrTablet = window.innerWidth < 1024 || /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;
    setIsMobileOrTablet(mobileOrTablet);
  }, []);

  const getVariants = () => {
    const defaultTransition = {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo-like curve
    };

    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: defaultTransition },
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0, transition: defaultTransition },
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0, transition: defaultTransition },
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0, transition: defaultTransition },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: defaultTransition },
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: defaultTransition },
        };
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delay,
      },
    },
  };

  // On mobile/tablet, render a static div to bypass all Framer Motion / IntersectionObserver overhead
  if (isMobileOrTablet) {
    return (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );
  }

  if (staggerChildren > 0) {
    return (
      <motion.div
        id={id}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={containerVariants}
        className={className}
        style={{ ...style, transition: 'none' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={getVariants()}
      className={className}
      style={{ ...style, transition: 'none' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
