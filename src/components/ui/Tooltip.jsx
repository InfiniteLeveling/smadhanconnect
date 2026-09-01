import React, { useState, useRef, useEffect } from 'react';

/**
 * Lightweight, accessible Tooltip component with smooth fade/slide transitions.
 * Appears after a short delay and positions itself accurately above/below the trigger.
 */
export const Tooltip = ({
  children,
  content,
  position = 'bottom',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none px-3 py-1.5 text-[11px] font-medium text-white bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-700/60 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${positionClasses[position]}`}
        >
          {content}
          {/* Tooltip arrow */}
          <div
            className={`absolute w-2 h-2 bg-slate-900 border-slate-700/60 transform rotate-45 ${
              position === 'bottom'
                ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l'
                : position === 'top'
                ? '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r'
                : position === 'right'
                ? '-left-1 top-1/2 -translate-y-1/2 border-b border-l'
                : '-right-1 top-1/2 -translate-y-1/2 border-t border-r'
            }`}
          />
        </div>
      )}
    </div>
  );
};
