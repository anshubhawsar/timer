"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Memory = { sender: string; text: string; sentiment: number; timestamp: string | null };

type Props = {
  /** Background image URL (already in /public so use as src directly) */
  backgroundSrc: string;
  /** Optional title for the overlay */
  title?: string;
  /** Main positivity message to display over the background */
  message?: string;
  /** When true, render this overlay as a page-like background section */
  showAsPageBg?: boolean;
};


function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function PositiveChatOverlay({
  backgroundSrc,
  title = "",
  message = "Hamari positivity ko aur high karo 💖",
  showAsPageBg = false
}: Props) {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const res = await fetch("/data/chat_data.json", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { happiest_memories: Memory[] };
      if (!mounted) return;
      setMemories(json.happiest_memories ?? []);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // High positivity: sentiment >= 0.35 (tuned for your sample happiest_memories)
  const filtered = useMemo(() => {
    const positive = memories.filter((m) => m.sentiment >= 0.35 && m.text?.trim());
    // Limit for performance
    return positive.slice(0, 22);
  }, [memories]);

  const bubbles = useMemo(() => {
    // Deterministic shuffle-ish: based on index so layout stays stable
    return filtered.map((m, i) => ({
      ...m,
      idx: i,
      // Precompute bubble placement so re-renders don't move them
      leftPct: 8 + ((i * 19) % 84),
      topPct: 6 + ((i * 23) % 80),
      // staggered sizes (slightly denser)
      scale: 0.9 + ((i % 6) * 0.035),
      delay: i * 0.095
    }));
  }, [filtered]);

  return (
    <section
      className={`relative overflow-hidden border border-white/10 bg-black/40 shadow-2xl ${showAsPageBg ? "mt-0 rounded-none" : "mt-10 rounded-3xl"}`}
    >
      <div className="absolute inset-0">
        <motion.img
          src={backgroundSrc}
          alt=""
          className="h-full w-full object-cover"
          initial={{ opacity: 0.3, scale: 1.03 }}
          animate={{ opacity: 0.35, scale: 1.0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        {/* Darken + blur */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(57,240,255,0.20),transparent_55%)]" />
      </div>

      {(title || message) ? (
        <div className="relative px-6 pt-6">
          {title ? (
            <div className="glass-card inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyanGlow">{title}</span>
            </div>
          ) : null}
          {message ? (
            <div className="mt-4 max-w-3xl">
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{message}</h2>
              <p className="mt-2 text-sm text-slate-200/80">
                Dates + messages floating over a darkened photo background.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="relative min-h-[28rem] px-5 pb-8 pt-6 md:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="science-grid absolute inset-0" />
          {/* animated galaxy stars overlay */}
          <div className="galaxy-stars" style={{ opacity: 0.75 }} />
        </div>


        <div className="relative mx-auto max-w-5xl">
          <div className="relative h-[30rem]">
            <AnimatePresence>
              {bubbles.map((m) => (
                <motion.div
                  key={`${m.timestamp ?? ""}-${m.idx}`}
                  initial={{ opacity: 0, y: 14, scale: m.scale }}
                  animate={{ opacity: 1, y: 0, scale: m.scale }}
                  transition={{ duration: 0.45, delay: m.delay, ease: "easeOut" }}
                  style={{ left: `${m.leftPct}%`, top: `${m.topPct}%` }}
                  className="absolute max-w-[19rem] -translate-x-1/2"
                >
                  <div className="relative rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-lg backdrop-blur-md">
                    {/* glow */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_left,rgba(57,240,255,0.22),transparent_60%)]" />

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-cyanGlow/90">
                          {m.sender}
                        </span>
                        <span className="text-[10px] text-slate-200/70">{formatDate(m.timestamp)}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/90">{m.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

