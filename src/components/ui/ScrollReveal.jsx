import React, { useEffect, useRef, useState } from 'react';

export const ScrollReveal = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade'
  threshold = 0.15,
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
        rootMargin: '0px 0px -40px 0px'
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
      return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    }

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-8 scale-[0.99]';
      case 'down':
        return 'opacity-0 -translate-y-8 scale-[0.99]';
      case 'left':
        return 'opacity-0 translate-x-8 scale-[0.99]';
      case 'right':
        return 'opacity-0 -translate-x-8 scale-[0.99]';
      case 'fade':
      default:
        return 'opacity-0 scale-[0.98]';
    }
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
};
