'use client';

import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 20,
    opacity: Math.random() * 0.3 + 0.1,
  }));
}

export function ParticleBackground() {
  const particles = useMemo(() => generateParticles(), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#c9a84c]"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            animation: `float ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
