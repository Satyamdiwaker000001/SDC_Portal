import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const StatCounter = ({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2, 
  delay = 0,
  className = '',
  label,
}) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const endValue = value;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * endValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, duration, delay]);

  return (
    <div className={className}>
      <div className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-fg-primary tabular-nums">
        {prefix}
        <span className="text-accent-cyan">{count.toLocaleString()}</span>
        {suffix}
      </div>
      {label && <p className="mt-1 font-mono text-xs text-fg-muted uppercase tracking-wider">{label}</p>}
    </div>
  );
};