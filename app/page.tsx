"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Sets to 12:00 AM of the next day

      const difference = midnight.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Happy Birthday Kittu in Advance! 🎂✨
        </h1>
        
        <div className="flex gap-4 md:gap-8 text-2xl md:text-5xl font-mono">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <motion.div 
              key={unit}
              className="flex flex-col items-center bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-cyan-400 font-bold">{value.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase tracking-widest text-slate-400 mt-2">{unit}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Background Animation Element */}
      <motion.div
        className="absolute -z-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-[128px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </div>
  );
}