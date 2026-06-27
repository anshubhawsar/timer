"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  dim: number;
  bright: number;
  driftX: number;
  driftY: number;
  midDriftX: number;
  midDriftY: number;
};

const STAR_COUNT = 240;

export default function GalaxyTwinkleBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: STAR_COUNT }, (_, id) => {
      const size = Math.random() < 0.82 ? Math.random() * 1.8 + 0.7 : Math.random() * 2.8 + 1.8;

      return {
        id,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size,
        delay: Math.random() * -8,
        duration: Math.random() * 4 + 2.6,
        dim: Math.random() * 0.22 + 0.12,
        bright: Math.random() * 0.35 + 0.65,
        driftX: Math.random() * 28 - 14,
        driftY: Math.random() * 24 - 12,
        midDriftX: Math.random() * 14 - 7,
        midDriftY: Math.random() * 12 - 6
      };
    });

    setStars(generatedStars);
  }, []);

  return (
    <div className="galaxy-twinkle-background pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="galaxy-nebula galaxy-nebula-one" />
      <div className="galaxy-nebula galaxy-nebula-two" />
      <div className="galaxy-nebula galaxy-nebula-three" />

      {stars.map((star) => (
        <div
          key={star.id}
          className="galaxy-star absolute rounded-full bg-white"
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              "--star-dim": star.dim,
              "--star-bright": star.bright,
              "--star-drift-x": `${star.driftX}px`,
              "--star-drift-y": `${star.driftY}px`,
              "--star-mid-drift-x": `${star.midDriftX}px`,
              "--star-mid-drift-y": `${star.midDriftY}px`
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
