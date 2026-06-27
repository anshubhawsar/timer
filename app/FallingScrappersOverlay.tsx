"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Scrapper = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  color: string;
  radius: string;
  opacity: number;
};

const SCRAPPER_COUNT = 120;
const SCRAPPER_COLORS = ["#f7a8ff", "#ffd1a8", "#39f0ff", "#9bff8e", "#ffffff", "#ff6f91", "#ffdf6e"];

export default function FallingScrappersOverlay() {
  const [scrappers, setScrappers] = useState<Scrapper[]>([]);

  useEffect(() => {
    const generatedScrappers = Array.from({ length: SCRAPPER_COUNT }, (_, id) => {
      const isCircle = Math.random() > 0.55;

      return {
        id,
        left: Math.random() * 100,
        size: Math.random() * 7 + 4,
        delay: Math.random() * -10,
        duration: Math.random() * 6 + 4,
        drift: Math.random() * 24 - 12,
        spin: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 540 + 360),
        color: SCRAPPER_COLORS[Math.floor(Math.random() * SCRAPPER_COLORS.length)],
        radius: isCircle ? "9999px" : "2px",
        opacity: Math.random() * 0.35 + 0.45
      };
    });

    setScrappers(generatedScrappers);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {scrappers.map((scrapper) => (
        <div
          key={scrapper.id}
          className="falling-scrapper absolute"
          style={
            {
              left: `${scrapper.left}%`,
              top: "-12vh",
              width: `${scrapper.size}px`,
              height: `${scrapper.size}px`,
              backgroundColor: scrapper.color,
              borderRadius: scrapper.radius,
              opacity: scrapper.opacity,
              animationDelay: `${scrapper.delay}s`,
              animationDuration: `${scrapper.duration}s`,
              "--scrapper-drift": `${scrapper.drift}vw`,
              "--scrapper-spin": `${scrapper.spin}deg`
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
