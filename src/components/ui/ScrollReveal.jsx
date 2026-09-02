import React, { useEffect, useRef, useState } from 'react';

export const ScrollReveal = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 800,
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade', 'scale'
  threshold = 0.12,
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100 filter-none';
    }

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-10 scale-[0.985]';
      case 'down':
        return 'opacity-0 -translate-y-10 scale-[0.985]';
      case 'left':
        return 'opacity-0 translate-x-10 scale-[0.985]';
      case 'right':
        return 'opacity-0 -translate-x-10 scale-[0.985]';
      case 'scale':
        return 'opacity-0 scale-95';
      case 'fade':
      default:
        return 'opacity-0 scale-[0.99]';
    }
  };

  return (
    <div
      ref={domRef}
      style={{ 
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`transition-all will-change-transform ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
};
