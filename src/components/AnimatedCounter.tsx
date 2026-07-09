import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const mobileOrTablet = window.innerWidth < 1024 || /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;
    setIsMobileOrTablet(mobileOrTablet);
  }, []);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isMobileOrTablet || !inView) return;

    const controls = animate(count, value, {
      duration: duration,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    });
    return () => controls.stop();
  }, [inView, value, duration, count, isMobileOrTablet]);

  // On mobile/tablet, render a static number immediately to save processing and observers
  if (isMobileOrTablet) {
    return (
      <span className={className}>
        {prefix}
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value.toLocaleString()}
        </span>
        {suffix}
      </span>
    );
  }

  // Ref is placed on motion.span to observe the scroll trigger
  return (
    <span ref={ref} className={className}>
      {prefix}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        <AnimatedSpan text={rounded} />
      </span>
      {suffix}
    </span>
  );
};

// Helper component to render the motion value as string content in React
import { MotionValue } from 'framer-motion';
const AnimatedSpan = ({ text }: { text: MotionValue<any> }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return text.on("change", (latest: any) => {
      if (spanRef.current) {
        spanRef.current.textContent = String(latest);
      }
    });
  }, [text]);

  return <span ref={spanRef}>0</span>;
};

export default AnimatedCounter;
