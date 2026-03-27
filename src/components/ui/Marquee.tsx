'use client';

import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  /** Speed in pixels per second (default: 50) */
  speed?: number;
  /** Direction of scroll (default: 'left') */
  direction?: 'left' | 'right';
  /** Pause on hover (default: true) */
  pauseOnHover?: boolean;
  /** Gap between items in pixels (default: 12) */
  gap?: number;
  className?: string;
}

export function Marquee({
  children,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  gap = 12,
  className = '',
}: MarqueeProps) {
  // Calculate animation duration based on speed
  // We'll use a fixed width estimate and let CSS handle the actual animation
  const animationDirection = direction === 'left' ? 'normal' : 'reverse';

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
      }}
    >
      <style>
        {`
          @keyframes marquee-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-scroll ${100000 / speed}ms linear infinite;
            animation-direction: ${animationDirection};
          }
          
          .marquee-track:hover {
            animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
          }
          
          .marquee-content {
            display: flex;
            gap: ${gap}px;
            flex-shrink: 0;
            padding-right: ${gap}px;
          }
        `}
      </style>
      <div className="marquee-track">
        <div className="marquee-content">
          {children}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
