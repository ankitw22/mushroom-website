'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PixelDividerProps {
  type: 'top' | 'bottom';
  color?: string;
}

export function PixelDivider({ type, color = 'var(--green)' }: PixelDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = useState<{ x: number; y: number; prob: number }[]>([]);

  useEffect(() => {
    const SZ = 32;
    const MAX_ROWS = 7;
    const w = containerRef.current?.offsetWidth || window.innerWidth;
    const cols = Math.ceil(w / SZ) + 1;
    const midCol = cols / 2;
    
    const newPixels = [];
    for (let col = 0; col < cols; col++) {
      const edgeness = Math.abs(col - midCol) / midCol;
      const rowCount = Math.round(1 + edgeness * edgeness * (MAX_ROWS - 1));
      
      for (let row = 0; row < rowCount; row++) {
        let prob = (rowCount - row) / rowCount * 0.85;
        if (row === 0) prob = 0.95;
        
        if (Math.random() < prob) {
          const x = col * SZ;
          const y = type === 'bottom' ? row * SZ : (MAX_ROWS - 1 - row) * SZ;
          newPixels.push({ x, y, prob });
        }
      }
    }
    setPixels(newPixels);
  }, [type]);

  return (
    <div 
      ref={containerRef}
      className={`pixel-edge-${type}`}
      style={{ 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        height: 224, 
        overflow: 'hidden', 
        pointerEvents: 'none', 
        zIndex: 2,
        ...(type === 'top' ? { top: -224 } : { bottom: -224 })
      }}
    >
      {pixels.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: 32,
            height: 32,
            background: color,
          }}
        />
      ))}
    </div>
  );
}
