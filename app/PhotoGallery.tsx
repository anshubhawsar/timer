"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Photo = { src: string; alt: string };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

// Magnetic Button Component for the "Random Highlight"
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    x.set(e.clientX - center.x);
    y.set(e.clientY - center.y);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden rounded-full border border-cyan-500/40 bg-black/40 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md transition-colors hover:bg-cyan-950/40"
    >
      {children}
    </motion.button>
  );
}

export default function PhotoGallery({
  photos,
  title = "Our Memories",
  subtitle = "Mind-blowing moments in motion",
}: {
  photos: Photo[];
  title?: string;
  subtitle?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activePhoto = photos[activeIndex];

  const tiles = useMemo(() => {
    return photos.map((p, idx) => ({ ...p, idx }));
  }, [photos]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  };

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl md:p-10">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -inset-1/2 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15),transparent_50%)] blur-3xl" />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-500/80">{subtitle}</p>
        </motion.div>

        <MagneticButton
          onClick={() => {
            setActiveIndex(Math.floor(Math.random() * photos.length));
            setLightboxOpen(true);
          }}
        >
          Random Highlight
        </MagneticButton>
      </div>

      {/* Grid */}
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial={false}
        animate="show"
        className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3"
      >
        {tiles.map((photo) => {
          const isActive = photo.idx === activeIndex;

          return (
            <motion.button
              key={photo.src}
              variants={prefersReducedMotion ? {} : itemVariants}
              type="button"
              onMouseEnter={() => setActiveIndex(photo.idx)}
              onFocus={() => setActiveIndex(photo.idx)}
              onClick={() => {
                setActiveIndex(photo.idx);
                setLightboxOpen(true);
              }}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-white/5 bg-black/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              whileHover={prefersReducedMotion ? undefined : { y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-80"
              />

              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
              
              <div
                className={`absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-between gap-3 transition-all duration-300 ${
                  isActive ? "translate-y-0 opacity-100" : "opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                }`}
              >
                <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
                  #{photo.idx + 1}
                </span>
                <span className="text-[10px] font-medium tracking-wide text-white/70">Expand ↗</span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Featured Active Image Section with Ken Burns effect */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-inner">
        <div className="relative aspect-[21/9] w-full md:aspect-[3/1]">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={activePhoto?.src}
              src={activePhoto?.src}
              alt={activePhoto?.alt}
              className="absolute inset-0 h-full w-full object-cover"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-end justify-between gap-4"
              >
                <h3 className="max-w-xl text-xl font-medium tracking-wide text-white/95 md:text-2xl">
                  {activePhoto?.alt}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm tracking-widest text-white/50">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLightboxOpen(true)}
                    className="rounded-full bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    View Full
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {lightboxOpen && activePhoto ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {/* Shared layout animation morphs the grid image into the lightbox */}
              <motion.img
                layoutId={prefersReducedMotion ? undefined : `photo-${activeIndex}`}
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
              />

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2"
              >
                <span className="text-sm font-medium tracking-widest text-white/60">
                  {activePhoto.alt}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)}
                    className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setActiveIndex((i) => (i + 1) % photos.length)}
                    className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="ml-4 rounded-full bg-red-500/20 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-200 backdrop-blur-md transition-colors hover:bg-red-500/40"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
