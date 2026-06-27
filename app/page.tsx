"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import FallingScrappersOverlay from "./FallingScrappersOverlay";
import GalaxyTwinkleBackground from "./GalaxyTwinkleBackground";
import PhotoGallery from "./PhotoGallery";
import { kittuPhotos } from "./kittuPhotos";
import PositiveChatOverlay from "./PositiveChatOverlay";
import { WeTogetherSection } from "./WeTogetherSection";

type HeatmapPoint = { hour: number; count: number };
type EmojiPoint = { emoji: string; count: number };
type Memory = { sender: string; text: string; sentiment: number; timestamp: string | null };
type TimelinePoint = { date: string; total: number; [key: string]: string | number };
type TopicCluster = { topic_id: number; keywords: string[]; label: string; weight: number };
type SpecialEvent = {
  event_type: string;
  date: string;
  mentions: number;
  highlight: string;
  timestamp: string | null;
};
type DayInsight = {
  top_message_days: { date: string; message_count: number }[];
  weekday_distribution: { weekday: string; count: number }[];
  longest_daily_streak: { length_days: number; start: string | null; end: string | null };
};
type MonthlyMood = { month: string; messages: number; avg_sentiment: number };
type ResponsePatterns = {
  overall_avg_reply_minutes: number;
  by_sender: {
    sender: string;
    avg_reply_minutes: number;
    median_reply_minutes: number;
    samples: number;
  }[];
};
type EmotionalHighlight = { date: string; avg_sentiment: number; messages: number };
type UnknownSenderAnalysis = {
  unknown_count: number;
  unknown_share_percent: number;
  resolution_breakdown: Record<string, number>;
  top_files_with_unknown: { file: string; count: number }[];
  classification_note: string;
};

type ChatData = {
  total_message_count: Record<string, number>;
  time_heatmap: HeatmapPoint[];
  emoji_leaderboard: Record<string, EmojiPoint[]>;
  pet_name_counter: {
    total: Record<string, number>;
    by_sender: Record<string, Record<string, number>>;
  };
  timeline: TimelinePoint[];
  happiest_memories: Memory[];
  topic_clusters: TopicCluster[];
  special_events: SpecialEvent[];
  day_insights: DayInsight;
  monthly_mood: MonthlyMood[];
  response_patterns: ResponsePatterns;
  emotional_highlights: EmotionalHighlight[];
  modeling: { topic_model: string; sentiment_model: string };
  unknown_sender_analysis: UnknownSenderAnalysis;
};

const chartColors = ["#39f0ff", "#9bff8e", "#53a5ff", "#ffb86b", "#ff6f91"];

// ✨ ENHANCED BIRTHDAY LETTER WITH EMOJIS & HIGHLIGHTS ✨
const birthdayLetter: ReactNode[] = [
  <>Sbse pehle apko janm din ki bahut bahut shubhkamnaye! 🎉 Wish you a very happy birthday meri madam ji 👑. Pta hai jb me apse roj bate krta tb itna acha lgta 🥺. Kahi bar aap aate late ho jate me aaram se wait krta rehta. <strong className="text-cyan-200 font-semibold drop-shadow-[0_0_8px_rgba(57,240,255,0.5)]">Apse bate krte time or bate kr ke itna acha lgta me bta nhi skta. ❤️</strong> Sari din bhr ki tension khtm ho jati.</>,
  
  <>Yad hai jb thode time pehle hmari bahut sarii bate ho rhi thi? Jb didi the, fir katha agai thi to ho jata, kbhi baba bahut sari krva dete, fir kbhii ap mna krte ki koii hai ya aj nhii hogi to me smj jata ki han, <strong className="text-slate-100">vo time nikal leti hai</strong>. ⏳💕</>,
  
  <>Or beta, <strong className="text-lime-200 font-semibold drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">hmesha ap apka dhyn rkha karo</strong>. 🌸 Nhi ho to bol diya kro time se, ache se khana khaya kro 🍱. Me wish krta hu ap hmesha khush rho ✨. Parso apne kaha tha ap bhi sochte honge kya bolti ye. Esa nhi hai beta, ap mujhe nhi btaoge to kise btaoge? <strong className="text-cyan-200 font-semibold drop-shadow-[0_0_8px_rgba(57,240,255,0.5)]">Apko pura hk hai apni problems sb share krne ka, or hm sari chije milkar solve krege abhi bhi or aage bhi. 🤝🥰</strong></>,
  
  <>Or hann betu, <strong className="text-pink-300 font-semibold drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]">ap mujhe bahut pyare lgte ho bahut sare</strong>. 💖 Us din apko 5 min dekha usme esa lga kahi alg duniya me chla gya tha me 🌌. Abhi bhi mujhe yad hai ap pehle andr fir bahar fir kutte ko biscuit dal rhe th 🐕. Mn kr rha kash me vapis aa pata apke birthday pr hm dono itni bate krte milkar, but koii na kuch sal or fir <strong className="text-slate-100">hm hmesha apke birthday bahut ach se celebrate krege</strong>. 🎂🥂</>,
  
  <>Me janta hu beta us din bhabhi ne jo kaha usse apko ajeeb lga hoga, rona bhi aaya 🥺. Lekin choro beta mt socho, kehne do. Kisi ke kehne se decide nhi hota kuch. Vo to kuch bhii keh dete. <strong className="text-lime-200 font-semibold drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">Ap kisi chij ki chinta mt kiya kro, hmesha smile krte rho. 😊</strong> Apne nhi sochna haina, bolne do. 🛡️</>,
  
  <>Or han betu ap mujhe bahut pyare lgte hai, bahut bahut pyare lgte ho, or hmesha bahuttt sare pyare lgoge! 💗 <br/><br/><span className="text-pink-400 font-extrabold text-2xl tracking-widest drop-shadow-[0_0_15px_rgba(236,72,153,1)]">I LOVEEEEE UH HIMANSHIII JI. 💖✨</span><br/><br/> Once again a very happy birthday my lovee 💘. <strong className="text-cyan-300 font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(57,240,255,0.8)]">Always with you. ♾️</strong></>
];

const tooltipStyle = {
  background: "#101822",
  border: "1px solid rgba(57,240,255,0.24)",
  borderRadius: "12px",
  color: "#e2e8f0",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
};

function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!target || target < 1) {
      setValue(0);
      return;
    }

    const frameMs = 16;
    const totalFrames = Math.max(1, Math.floor(duration / frameMs));
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame += 1;
      const progress = currentFrame / totalFrames;
      setValue(Math.floor(target * Math.min(progress, 1)));
      if (currentFrame >= totalFrames) {
        clearInterval(timer);
      }
    }, frameMs);

    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

function normalizeHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function formatEventName(input: string): string {
  return input
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// ✨ MIND-BLOWING INTERACTIVE SCRAPPER COMPONENT ✨
function ClickableScrapper({ isHeart, initialLeft, delay, duration }: { isHeart: boolean, initialLeft: number, delay: number, duration: number }) {
  const [popped, setPopped] = useState(false);

  if (popped) {
    return (
      <motion.div
        className="absolute z-[100] text-4xl pointer-events-none drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]"
        style={{ left: `${initialLeft}%`, top: '40%' }}
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ 
          scale: [1, 2.5, 3.5], 
          opacity: [1, 0.9, 0], 
          rotate: [0, isHeart ? -45 : 90, isHeart ? -90 : 180] 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {isHeart ? "💖✨" : "✨💫"}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`absolute ${isHeart ? "text-pink-400/80 drop-shadow-[0_0_12px_rgba(236,72,153,0.9)]" : "text-cyan-300/80 drop-shadow-[0_0_12px_rgba(57,240,255,0.9)]"} text-3xl cursor-pointer pointer-events-auto z-[60]`}
      style={{ left: `${initialLeft}%`, top: "-10%" }}
      initial={{ opacity: 0, y: "-10vh", rotate: 0 }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, Math.random() * 150 - 75, Math.random() * 150 - 75],
        rotate: [0, 360],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      onClick={(e) => {
        setPopped(true);
        setTimeout(() => setPopped(false), 8000); // Respawns after 8 seconds!
      }}
      whileHover={{ scale: 2.2, textShadow: "0px 0px 30px rgb(255,255,255)" }}
      whileTap={{ scale: 0.8 }}
    >
      {isHeart ? "💖" : "✨"}
    </motion.div>
  );
}

function FloatingScrappersForHer() {
  const elements = Array.from({ length: 30 }); // Increased density
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {elements.map((_, i) => (
        <ClickableScrapper 
          key={i}
          isHeart={i % 3 === 0}
          initialLeft={Math.random() * 100}
          delay={Math.random() * 10}
          duration={Math.random() * 15 + 12}
        />
      ))}
    </div>
  );
}

// ✨ THE INTERACTIVE GUIDE BANNER ✨
function InteractiveScrapperGuide() {
  const [visible, setVisible] = useState(true);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 2.5 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto flex flex-col items-center gap-2 w-[90%] max-w-sm"
        >
          <motion.div 
            className="rounded-full border border-pink-500/50 bg-black/70 px-5 py-3 text-sm text-pink-100 shadow-[0_0_25px_rgba(236,72,153,0.4)] backdrop-blur-xl flex items-center justify-between w-full cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(236,72,153,0.7)" }}
            onClick={() => setVisible(false)}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500 shadow-[0_0_10px_#ec4899]"></span>
              </span>
              <span className="font-medium tracking-wide">Tap the glowing hearts & sparkles! ✨</span>
            </div>
            <span className="text-slate-400 text-xs hover:text-white transition-colors uppercase tracking-widest bg-white/10 px-2 py-1 rounded-full">Got it</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced AnimatedSection with fluid easing
function AnimatedSection({
  children,
  className,
  delay = 0
}: {
  children: ReactNode;
  className: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: [0.17, 0.55, 0.55, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const [data, setData] = useState<ChatData | null>(null);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memory, setMemory] = useState<Memory | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/data/chat_data.json", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const json = (await response.json()) as ChatData;
      setData(json);
    };

    load();
  }, []);

  const totals = data?.total_message_count ?? {};
  const totalMessages = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const animatedTotal = useCountUp(totalMessages);

  const timelineData = data?.timeline ?? [];
  const hourData = (data?.time_heatmap ?? []).map((item) => ({
    ...item,
    label: normalizeHour(item.hour)
  }));
  const monthlyMood = data?.monthly_mood ?? [];
  const events = (data?.special_events ?? []).slice(0, 10);
  const dayInsights = data?.day_insights;
  const topics = data?.topic_clusters ?? [];
  const emotionalHighlights = data?.emotional_highlights ?? [];
  const unknownSender = data?.unknown_sender_analysis;

  const galleryPhotos = useMemo(
    () => kittuPhotos.map((src, index) => ({ src, alt: `Kittu memory ${index + 1}` })),
    []
  );

  const topFiveEmojis = useMemo(() => {
    if (!data) {
      return [] as EmojiPoint[];
    }

    const merged: Record<string, number> = {};
    Object.values(data.emoji_leaderboard).forEach((list) => {
      list.forEach((entry) => {
        merged[entry.emoji] = (merged[entry.emoji] ?? 0) + entry.count;
      });
    });

    return Object.entries(merged)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  const topPetNames = useMemo(() => {
    return Object.entries(data?.pet_name_counter?.total ?? {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [data]);

  const topMessageDays = dayInsights?.top_message_days?.slice(0, 4) ?? [];
  const topTopics = topics.slice(0, 5);

  const openRandomMemory = () => {
    if (!data?.happiest_memories?.length) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * data.happiest_memories.length);
    setMemory(data.happiest_memories[randomIndex]);
    setMemoryOpen(true);
  };

  const mindblowingHover = { 
    y: -8, 
    scale: 1.02, 
    boxShadow: "0 25px 50px -12px rgba(57, 240, 255, 0.3), inset 0 0 25px rgba(57, 240, 255, 0.15)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  return (
    <main className="science-grid relative min-h-screen overflow-hidden bg-[#050810] px-4 pb-24 pt-6 sm:px-6 md:px-10 md:pt-10">
      <GalaxyTwinkleBackground />
      <FallingScrappersOverlay />
      
      {/* Our glorious new interactive additions */}
      <InteractiveScrapperGuide />
      <FloatingScrappersForHer />

      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="aurora a-one" />
        <div className="aurora a-two" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 md:gap-8">
        <motion.section
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.17, 0.55, 0.55, 1] }}
          className="glass-card relative overflow-hidden rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Pulsing ambient glows */}
          <motion.div 
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-lime-400/20 blur-3xl"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <div className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-white/10 bg-black/30 md:min-h-[30rem] group">
            <motion.img
              src={kittuPhotos[0] ?? "/kittuimgs/photo_2026-06-24_19-15-17.jpg"}
              alt="Kittu birthday memory"
              className="absolute inset-0 h-full w-full object-cover"
              animate={{ scale: [1, 1.08, 1], x: [0, -15, 10, 0], y: [0, 10, -5, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}>
                <p className="mono text-xs uppercase tracking-[0.25em] text-slate-300 drop-shadow-md">Total messages</p>
                <p className="mt-2 text-4xl font-semibold text-cyan-300 drop-shadow-[0_0_15px_rgba(57,240,255,0.8)]">{animatedTotal.toLocaleString()}</p>
              </motion.div>
            </div>
          </div>

          <div className="relative mt-12 min-w-0">
            <motion.p 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.8 }}
              className="mono mb-4 text-xs font-bold uppercase tracking-[0.28em] text-cyanGlow"
            >
              Hamari Data Love Story ✨
            </motion.p>
            
            {/* ✨ MIND-BLOWING GLOWING TITLE ✨ */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.h1 
                className="text-6xl font-extrabold leading-tight md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-cyan-300 to-pink-400 drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]"
                animate={{ backgroundPosition: ["0%", "200%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% auto" }}
              >
                Happy Birthday, Kittu
              </motion.h1>
              <motion.span 
                className="text-5xl md:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                🎉👑
              </motion.span>
            </div>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl font-medium"
            >
              A clean little birthday dashboard for our photos, chats, happiest moments, and the tiny patterns
              that made all those conversations feel special.
            </motion.p>
          </div>

          <div className="relative mt-10 border-t border-white/10 pt-8">
            <div className="max-w-4xl space-y-6 text-sm leading-relaxed text-slate-200 md:text-[17px] md:leading-[1.9]">
              {/* Staggered text reveal for the beautiful letter */}
              {birthdayLetter.map((paragraph, idx) => (
                <motion.p 
                  key={`letter-para-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.section>

        <AnimatedSection className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <motion.div 
            className="glass-card rounded-3xl p-6 md:p-8"
            whileHover={mindblowingHover}
          >
            <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">Total Messages Bheje Gaye</p>
            <p className="mt-3 text-6xl font-bold text-cyanGlow md:text-7xl drop-shadow-[0_0_20px_rgba(57,240,255,0.4)]">{animatedTotal.toLocaleString()}</p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              {Object.entries(totals).map(([name, count]) => (
                <motion.div 
                  key={name} 
                  whileHover={{ x: 8, color: "#fff", scale: 1.02 }}
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0 transition-all cursor-default"
                >
                  <span className="mono text-sm uppercase tracking-widest text-slate-400">{name}</span>
                  <span className="text-xl font-medium text-limeGlow">{count.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="glass-card rounded-3xl p-6 md:p-8"
            whileHover={mindblowingHover}
          >
            <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">Quick Conversation Snapshot</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                <p className="mono text-xs uppercase tracking-widest text-slate-400">Longest Streak</p>
                <p className="mt-2 text-3xl font-bold text-cyanGlow drop-shadow-md">
                  {dayInsights?.longest_daily_streak?.length_days ?? 0} <span className="text-xl font-medium">days</span>
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                <p className="mono text-xs uppercase tracking-widest text-slate-400">Avg Reply</p>
                <p className="mt-2 text-3xl font-bold text-limeGlow drop-shadow-md">
                  {data?.response_patterns?.overall_avg_reply_minutes?.toFixed(1) ?? "0.0"} <span className="text-xl font-medium">min</span>
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
                <p className="mono text-xs uppercase tracking-widest text-slate-400">Peak Days</p>
                <p className="mt-2 text-3xl font-bold text-cyanGlow drop-shadow-md">{emotionalHighlights.length}</p>
              </motion.div>
            </div>

            <div className="mt-8">
              <p className="mono text-xs uppercase tracking-[0.18em] text-slate-400">Top message days</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {topMessageDays.map((day, idx) => (
                  <motion.div 
                    key={day.date} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(57,240,255,0.1)", borderColor: "rgba(57,240,255,0.3)" }}
                    className="rounded-2xl border border-slate-700/60 bg-black/30 p-5 cursor-default transition-colors"
                  >
                    <p className="text-base font-medium text-slate-100">{day.date}</p>
                    <p className="mono mt-1 text-sm text-cyanGlow">{day.message_count.toLocaleString()} msgs</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="glass-card rounded-3xl p-6 md:p-8">
          <motion.div whileHover={mindblowingHover} className="w-full h-full rounded-3xl">
            <h2 className="text-3xl font-semibold">Chat Timeline</h2>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Kaunse din hum sabse zyada connected the
            </p>
            <div className="mt-8 h-[22rem] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39f0ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#39f0ff" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#8fa7c5" tick={{ fontSize: 12 }} minTickGap={24} />
                  <YAxis stroke="#8fa7c5" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(57,240,255,0.4)', strokeWidth: 2 }} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }}/>
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#39f0ff" 
                    fill="url(#timelineFill)" 
                    strokeWidth={3} 
                    activeDot={{ r: 8, fill: "#fff", stroke: "#39f0ff", strokeWidth: 2 }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="grid gap-6 md:grid-cols-2">
          <motion.div 
            className="glass-card rounded-3xl p-6 md:p-8"
            whileHover={mindblowingHover}
          >
            <h3 className="text-2xl font-semibold">Hamara Time Pattern</h3>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Din ke kis ghante mein sabse zyada baat hui
            </p>
            <div className="mt-8 h-80 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" interval={2} angle={-25} textAnchor="end" height={60} stroke="#8fa7c5" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8fa7c5" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {hourData.map((entry, index) => (
                      <Cell key={`${entry.hour}-${index}`} fill={index % 2 === 0 ? "#39f0ff" : "#9bff8e"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            className="glass-card rounded-3xl p-6 md:p-8"
            whileHover={mindblowingHover}
          >
            <h3 className="text-2xl font-semibold">Top 5 Emojis</h3>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Humari expression language</p>
            <div className="mt-8 space-y-5">
              {topFiveEmojis.map((item, index) => (
                <motion.div 
                  key={item.emoji} 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, type: "spring" }}
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="rounded-2xl border border-slate-700/50 bg-black/30 p-5 cursor-default transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-4xl filter drop-shadow-lg">{item.emoji}</p>
                    <p className="mono text-sm font-bold uppercase tracking-widest text-slate-400">#{index + 1}</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-slate-800/80 overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(10, (item.count / Math.max(topFiveEmojis[0]?.count ?? 1, 1)) * 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.3 + (index * 0.15), ease: "easeOut" }}
                      style={{ background: chartColors[index % chartColors.length], color: chartColors[index % chartColors.length] }}
                    />
                  </div>
                  <p className="mono mt-3 text-xs font-medium text-slate-300">{item.count} baar use hua</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="glass-card rounded-3xl p-6 md:p-8">
          <motion.div whileHover={mindblowingHover} className="w-full h-full rounded-3xl">
            <h2 className="text-3xl font-semibold">Monthly Mood aur Intensity</h2>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Mahine-dar-mahine vibe aur positivity ka flow
            </p>
            <div className="mt-8 h-[22rem] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyMood}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#8fa7c5" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke="#8fa7c5" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9bff8e" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line yAxisId="left" type="monotone" dataKey="messages" stroke="#39f0ff" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="avg_sentiment" stroke="#9bff8e" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="grid gap-6 md:grid-cols-2">
          <motion.div 
            className="glass-card rounded-3xl p-6 md:p-8"
            whileHover={mindblowingHover}
          >
            <h3 className="text-2xl font-semibold">Special Event Highlights</h3>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Hamare milestones aur repeat hone wale special moments
            </p>
            <div className="mt-6 max-h-[32rem] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {events.map((event, idx) => (
                <motion.div 
                  key={`${event.event_type}-${event.date}-${idx}`} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(57,240,255,0.08)", borderColor: "rgba(57,240,255,0.3)" }}
                  className="rounded-2xl border border-slate-700/50 bg-black/30 p-5 cursor-default transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="mono text-xs font-bold uppercase tracking-wider text-cyanGlow drop-shadow-sm">{formatEventName(event.event_type)}</p>
                    <p className="mono text-xs font-medium text-slate-400">{event.date}</p>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-200">
                    {event.highlight || "Yahan hamari convo ka ek special moment capture hua"}
                  </p>
                  <p className="mono mt-3 text-xs font-semibold text-limeGlow drop-shadow-sm">Mentions: {event.mentions}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="glass-card rounded-3xl p-6 md:p-8"
            whileHover={mindblowingHover}
          >
            <h3 className="text-2xl font-semibold">Themes, Names, and Cleanup</h3>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Side insights grouped in one tidy place
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <p className="mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">Topic clusters</p>
                <div className="space-y-4">
                  {topTopics.map((topic, idx) => (
                    <motion.div 
                      key={topic.topic_id} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15, type: "spring" }}
                      whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.05)" }}
                      className="rounded-2xl border border-slate-700/50 bg-black/30 p-5 cursor-default transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-semibold text-slate-100">{topic.label}</p>
                        <p className="mono text-sm font-bold text-cyanGlow">{topic.weight.toFixed(2)}</p>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{topic.keywords.slice(0, 8).join(", ")}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <motion.div whileHover={{ scale: 1.06, y: -4 }} className="rounded-2xl border border-slate-700/50 bg-black/30 p-5 cursor-default">
                  <p className="mono text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Pet names</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topPetNames.map(([name, count]) => (
                      <span key={name} className="rounded-full border border-cyanGlow/40 bg-cyanGlow/5 px-3 py-1.5 text-xs font-medium text-cyanGlow shadow-[0_0_10px_rgba(57,240,255,0.1)]">
                        {name} {count}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.06, y: -4 }} className="rounded-2xl border border-slate-700/50 bg-black/30 p-5 cursor-default">
                  <p className="mono text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Unknown senders</p>
                  <p className="mt-3 text-3xl font-bold text-limeGlow drop-shadow-md">{unknownSender?.unknown_count ?? 0}</p>
                  <p className="mono mt-2 text-xs font-medium text-slate-300">
                    {unknownSender?.unknown_share_percent?.toFixed(2) ?? "0.00"}% of messages
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="glass-card rounded-3xl p-6 md:p-8">
          <motion.div whileHover={mindblowingHover} className="w-full h-full rounded-3xl">
            <h3 className="text-3xl font-semibold">Emotional High-Point Days</h3>
            <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Woh din jahan overall positivity sabse high thi
            </p>
            <div className="mt-8 h-80 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionalHighlights}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#8fa7c5" tick={{ fontSize: 11 }} minTickGap={16} />
                  <YAxis stroke="#8fa7c5" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="avg_sentiment" radius={[8, 8, 0, 0]} fill="#9bff8e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="scroll-mt-8" delay={0.05}>
          <PhotoGallery
            photos={galleryPhotos}
            title="Our Happiest Moments"
            subtitle="Photos arranged in one proper gallery"
          />
        </AnimatedSection>

        <AnimatedSection className="scroll-mt-8" delay={0.05}>
          <WeTogetherSection
            title="We Together"
            subtitle="Our journey in pictures"
          />
        </AnimatedSection>

        <AnimatedSection className="scroll-mt-8" delay={0.05}>
          <PositiveChatOverlay
            backgroundSrc={kittuPhotos[0] ?? "/kittuimgs/photo_2026-06-24_19-15-17.jpg"}
            title="From our happiest moments"
            message="Every message, every smile - positivity looks better when it is ours"
          />
        </AnimatedSection>
      </div>

      <motion.button
        type="button"
        onClick={openRandomMemory}
        whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(57, 240, 255, 0.6)" }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[80] max-w-[calc(100vw-3rem)] rounded-full border border-cyanGlow/60 bg-black/90 px-6 py-4 text-sm font-bold text-cyanGlow shadow-[0_0_20px_rgba(57,240,255,0.3)] backdrop-blur-xl transition-colors md:bottom-8 md:right-8 uppercase tracking-widest"
      >
        Ek Random Memory Dikhao ✨
      </motion.button>

      <AnimatePresence>
        {memoryOpen && memory ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMemoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 60, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30, rotateX: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(event) => event.stopPropagation()}
              className="glass-card relative w-full max-w-2xl rounded-[2rem] p-8 md:p-10 shadow-[0_0_80px_rgba(57,240,255,0.2)] overflow-hidden"
            >
              {/* Internal glow for memory card */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <p className="mono text-sm font-bold uppercase tracking-[0.25em] text-cyanGlow flex items-center gap-3">
                  <span className="text-xl">✨</span> Hamari Happiest Memory
                </p>
                <p className="mt-6 text-xl leading-[1.8] text-white drop-shadow-md font-medium">{memory.text}</p>
                
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-300">
                  <span className="bg-white/10 px-4 py-2 rounded-full font-medium">{memory.sender}</span>
                  <span className="mono bg-lime-400/10 text-lime-400 px-4 py-2 rounded-full font-bold shadow-[0_0_10px_rgba(163,230,53,0.2)]">Sentiment {memory.sentiment.toFixed(3)}</span>
                </div>
                
                <motion.button
                  type="button"
                  onClick={() => setMemoryOpen(false)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.15)", scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mono w-full mt-8 rounded-xl border border-slate-500/50 bg-black/40 px-6 py-4 text-sm font-bold uppercase tracking-widest text-slate-200 transition-all hover:border-slate-400"
                >
                  Band Karo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}