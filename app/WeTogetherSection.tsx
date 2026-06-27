import { motion } from "framer-motion";
import { wetogetherPhotos } from "./wetogetherPhotos"; // Assuming this file is in the same directory

interface WeTogetherSectionProps {
  title: string;
  subtitle: string;
}

export function WeTogetherSection({ title, subtitle }: WeTogetherSectionProps) {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="glass-card scroll-mt-8 rounded-3xl p-6 md:p-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-medium md:text-3xl">{title}</h2>
        <p className="mono mt-1 text-xs uppercase tracking-[0.2em] text-slate-400 md:text-sm">
          {subtitle}
        </p>
      </div>

      <div className="relative mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {wetogetherPhotos.map((photoSrc, index) => (
          <motion.div
            key={photoSrc}
            initial={{ opacity: 0, scale: 0.8, y: 50, rotate: index % 2 === 0 ? -5 : 5 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.6,
              delay: 0.1 * index, // Staggered reveal
              ease: [0.17, 0.67, 0.83, 0.67], // Custom easing for a playful bounce
            }}
            className="relative aspect-square overflow-hidden rounded-xl shadow-lg border border-white/10"
          >
            <img
              src={photoSrc}
              alt={`We Together photo ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}