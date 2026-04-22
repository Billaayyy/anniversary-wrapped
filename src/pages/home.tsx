import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useInView } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

// Import generated images
import album1 from "@/assets/images/album-1.png";
import album2 from "@/assets/images/album-2.png";
import album3 from "@/assets/images/album-3.png";
import album4 from "@/assets/images/album-4.png";
import album5 from "@/assets/images/album-5.png";

import artist1 from "@/assets/images/artist-1.png";
import artist2 from "@/assets/images/artist-2.png";
import artist3 from "@/assets/images/artist-3.png";
import artist4 from "@/assets/images/artist-4.png";
import artist5 from "@/assets/images/artist-5.png";

import soundTownBg from "@/assets/images/sound-town.png";

import photo1 from "@/assets/images/photo-1.png";
import photo2 from "@/assets/images/photo-2.png";
import photo3 from "@/assets/images/photo-3.png";
import photo4 from "@/assets/images/photo-4.png";

// ============================================================================
// 💝 EDIT THESE VARIABLES TO PERSONALIZE THE WRAPPED EXPERIENCE
// ============================================================================
const CONFIG = {
  herName: "Sarah",
  yourName: "Alex",
  anniversaryDate: "2021-04-22", // YYYY-MM-DD
  
  // Slide 2: Top Songs (Title + Artist)
  topSongs: [
    { title: "Midnight City Drives", artist: "Just Us", cover: album1 },
    { title: "Sunday Morning Coffee", artist: "The Lazy Weekends", cover: album2 },
    { title: "Laughing Too Loud", artist: "Inside Jokes", cover: album3 },
    { title: "Holding Hands In Public", artist: "Unabashed", cover: album4 },
    { title: "Forever & Always", artist: "Us", cover: album5 },
  ],

  // Slide 3: Top Artists (Moods/Seasons of the relationship)
  topArtists: [
    { name: "Summer of 2023", streams: "8,402", image: artist1 },
    { name: "Late Night Talks", streams: "6,210", image: artist2 },
    { name: "Autumn Walks", streams: "5,930", image: artist3 },
    { name: "Rainy Movie Days", streams: "4,105", image: artist4 },
    { name: "Spring Picnics", streams: "3,890", image: artist5 },
  ],

  // Slide 4: Now Playing
  nowPlaying: {
    song: "You & Me",
    artist: "The Rest of Our Lives",
    cover: album1
  },

  // Slide 5: Sound Town
  soundTown: {
    city: "Paris, France",
    description: "Your love sounds like golden hours along the Seine and midnight crepes.",
    bg: soundTownBg
  },

  // Slide 6: Polaroids
  photos: [
    { image: photo1, caption: "That first sunset." },
    { image: photo2, caption: "Always holding on." },
    { image: photo3, caption: "Our usual spot." },
    { image: photo4, caption: "Getting lost together." },
    { image: album1, caption: "Late night drives." },
    { image: artist1, caption: "Just us, golden hour." },
  ],

  // Slides 7-9: Stats
  stats: [
    { label: "Texts sent saying 'I miss you'", value: 14205, punchline: "And I meant it every single time." },
    { label: "TikToks shared", value: 38491, punchline: "Mostly cats and recipes we'll never make." },
    { label: "Kilometers traveled together", value: 8432, punchline: "And I'd walk 10,000 more just to see you smile." },
  ],

  topMoments: [
    "That night in Chicago",
    "Getting lost in the rain",
    "The burnt dinner incident",
    "Moving in together",
    "Every lazy Sunday morning",
  ],
  loveSoundsLike: "Late night drives, early morning coffees, and uncontrollable laughter.",
  habits: [
    "Stealing the covers",
    "Sending 100 TikToks a day",
    "Saying 'I love you' first",
  ],
  closingMessage: "To my favorite person. Thank you for the best 3 years of my life. Here's to a lifetime more.",

  // Slide: Achievements unlocked together (checklist)
  achievements: [
    "Survived our first big fight",
    "Adopted our first plant (and kept it alive)",
    "Built a thousand inside jokes",
    "Learned every one of each other's coffee orders",
    "Met the families",
    "Planned a future together",
  ],
};
// ============================================================================

const SLIDES = [
  { id: "intro", bg: "#1DB954", text: "#FFFFFF" }, // Spotify Green
  { id: "days", bg: "#4A00FF", text: "#00FFC4" },
  { id: "top-songs", bg: "#282828", text: "#FFFFFF" },
  { id: "top-artists", bg: "#FF007F", text: "#FFFFFF" },
  { id: "now-playing", bg: "#121212", text: "#1DB954" },
  { id: "sound-town", bg: "#000000", text: "#FFFFFF" },
  { id: "polaroids", bg: "#F4F4F4", text: "#121212" },
  { id: "stat-1", bg: "#FF4D00", text: "#FFF000" },
  { id: "stat-2", bg: "#00E5FF", text: "#001AFF" },
  { id: "stat-3", bg: "#B500FF", text: "#FFB000" },
  { id: "moments", bg: "#FFD700", text: "#FF0055" },
  { id: "habits", bg: "#1A1A1A", text: "#1DB954" },
  { id: "quiet", bg: "#1A1A1A", text: "#E5E5E5" },
  { id: "achievements", bg: "#0A1A0F", text: "#1DB954" },
  { id: "finale", bg: "#1DB954", text: "#FFFFFF" },
];

function AnimatedCounter({ value, duration = 2, active }: { value: number, duration?: number, active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;
    let startTimestamp: number;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      if (ref.current) {
        ref.current.innerText = Math.floor(easeProgress * value).toLocaleString();
      }
      if (progress < 1) {
        raf = window.requestAnimationFrame(step);
      } else {
        if (ref.current) ref.current.innerText = value.toLocaleString();
      }
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [active, value, duration]);

  return <span ref={ref}>0</span>;
}

function PolaroidsSlide({ bg, text, photos }: { bg: string; text: string; photos: { image: string; caption: string }[] }) {
  const slideRef = useRef<HTMLDivElement>(null);
  const inView = useInView(slideRef, { margin: "-30%" });
  const [expanded, setExpanded] = useState(false);

  // Reset expansion when leaving the slide
  useEffect(() => {
    if (!inView) setExpanded(false);
  }, [inView]);

  const expand = () => setExpanded(true);

  return (
    <div
      ref={slideRef}
      onClick={expand}
      onWheel={expand}
      onTouchStart={expand}
      className="w-full h-full snap-center snap-always flex flex-col items-center justify-center p-8 shrink-0 relative overflow-hidden cursor-pointer"
      style={{ backgroundColor: bg, color: text }}
    >
      {/* Background scrolling photo columns — pure CSS for GPU perf */}
      <div className="absolute inset-0 pointer-events-none flex justify-between opacity-40 z-0">
        <div className="w-[40%] h-full overflow-hidden relative">
          <div
            className="flex flex-col gap-3 absolute top-0 left-0 right-0 polaroids-scroll-up"
            style={{ willChange: "transform" }}
          >
            {[...photos, ...photos].map((photo, i) => (
              <div key={`l-${i}`} className="bg-white p-2 pb-6 shadow-xl rounded-sm rotate-[-4deg]">
                <img src={photo.image} alt="" loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-[40%] h-full overflow-hidden relative">
          <div
            className="flex flex-col gap-3 absolute top-0 left-0 right-0 polaroids-scroll-down"
            style={{ willChange: "transform" }}
          >
            {[...photos.slice().reverse(), ...photos.slice().reverse()].map((photo, i) => (
              <div key={`r-${i}`} className="bg-white p-2 pb-6 shadow-xl rounded-sm rotate-[4deg]">
                <img src={photo.image} alt="" loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F4F4]/70 via-[#F4F4F4]/30 to-[#F4F4F4]/70 z-0 pointer-events-none" />

      {/* Header — fades to new copy when expanded */}
      <div className="absolute top-16 w-full text-center z-20 px-6 h-16">
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.h2
              key="highlights"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-black uppercase tracking-tighter"
            >
              The Highlights
            </motion.h2>
          ) : (
            <motion.div
              key="cute-moments"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                Take a look at our<br />
                <span className="text-[#1DB954]">cute moments!</span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo stack / spread */}
      <div className="relative w-full aspect-square mt-10 z-10">
        {photos.map((photo, i) => {
          const restRotate = (i % 2 === 0 ? 1 : -1) * (i * 4 + 2);

          // Stacked layout (default)
          const stackedAnim = {
            opacity: 1,
            scale: 1,
            rotate: restRotate,
            x: "0%",
            y: "0%",
          };

          // Expanded grid: 2 cols x 3 rows — tighter & larger
          const col = i % 2;
          const row = Math.floor(i / 2);
          const expandedAnim = {
            opacity: 1,
            scale: 0.55,
            rotate: (i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 1.5),
            x: `${(col - 0.5) * 70}%`,
            y: `${(row - 1) * 70}%`,
          };

          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 1.3,
                rotate: (i % 2 === 0 ? -15 : 15),
              }}
              animate={inView ? (expanded ? expandedAnim : stackedAnim) : { opacity: 0, scale: 1.3 }}
              transition={
                expanded
                  ? { delay: i * 0.06, type: "spring", stiffness: 110, damping: 15 }
                  : { delay: i * 0.25, type: "spring", bounce: 0.35 }
              }
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ zIndex: i + 5, willChange: "transform" }}
            >
              <div className="bg-white p-3 pb-8 rounded-sm shadow-2xl w-3/4 flex flex-col">
                <img src={photo.image} alt={photo.caption} loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
                <p className="mt-3 text-center font-bold text-xs font-sans text-black">{photo.caption}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tap hint */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.6, 1], y: [0, -4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
            className="absolute bottom-10 z-20 text-xs font-bold tracking-[0.3em] uppercase text-black/60"
          >
            Tap to spread
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AchievementsSlide({ bg, text, achievements, onComplete }: { bg: string; text: string; achievements: string[]; onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-30%" });
  const [checked, setChecked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!inView) {
      setChecked([]);
      setDone(false);
      firedRef.current = false;
      return;
    }
    const timers: number[] = [];
    achievements.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setChecked((prev) => [...prev, i]);
        if (i === achievements.length - 1) {
          const finishT = window.setTimeout(() => {
            setDone(true);
            if (!firedRef.current) {
              firedRef.current = true;
              onComplete();
            }
          }, 700);
          timers.push(finishT);
        }
      }, 600 + i * 550);
      timers.push(t);
    });
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [inView, achievements, onComplete]);

  return (
    <div
      ref={ref}
      className="w-full h-full snap-center snap-always flex flex-col justify-center px-6 py-10 shrink-0 relative overflow-hidden"
      style={{ backgroundColor: bg, color: text }}
    >
      {/* Floating orbs */}
      <motion.div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#1DB954]/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-20 w-72 h-72 rounded-full bg-[#1DB954]/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <p className="text-[10px] font-bold tracking-[0.3em] opacity-70 mb-2">ACHIEVEMENTS UNLOCKED</p>
          <h1 className="text-3xl font-black leading-[0.95] tracking-tighter text-white">
            Look at{" "}
            <span className="text-[#1DB954]">everything</span> we've done.
          </h1>
        </motion.div>

        <div className="flex flex-col gap-2">
          {achievements.map((item, i) => {
            const isChecked = checked.includes(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 120 }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur rounded-xl px-3 py-2.5 border border-white/10"
              >
                <motion.div
                  animate={isChecked ? { scale: [1, 1.4, 1], backgroundColor: "#1DB954" } : { backgroundColor: "rgba(255,255,255,0.08)" }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#1DB954]/40"
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.svg
                        key="check"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <motion.path
                          d="M5 12l5 5L20 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span
                  animate={isChecked ? { color: "#FFFFFF" } : { color: "rgba(255,255,255,0.55)" }}
                  className="text-sm font-bold leading-snug"
                >
                  {item}
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mt-5 text-center"
            >
              <div className="inline-block px-5 py-2 rounded-full bg-[#1DB954] text-black font-black tracking-wide text-sm shadow-2xl shadow-[#1DB954]/40">
                100% COMPLETE
              </div>
              <p className="mt-2 text-white/70 text-xs font-medium">And we're just getting started.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    setActiveSlide(index);
  };

  const daysTogether = useMemo(() => {
    const start = new Date(CONFIG.anniversaryDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, []);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#1DB954", "#FFFFFF", "#FF007F", "#FFF000"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#1DB954", "#FFFFFF", "#FF007F", "#FFF000"],
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden font-display selection:bg-[#1DB954] selection:text-white">
      {/* Mobile constraint wrapper */}
      <div className="w-full h-full max-w-[430px] relative bg-black overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:h-[90%] sm:my-auto sm:border-8 border-gray-900">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3 pointer-events-none">
          {SLIDES.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                initial={{ width: "0%" }}
                animate={{ width: activeSlide >= i ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Global Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DB954] rounded-full mix-blend-screen filter blur-[100px] opacity-30"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF007F] rounded-full mix-blend-screen filter blur-[100px] opacity-20"
          />
        </div>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory hide-scrollbar relative z-10"
          style={{ scrollBehavior: "smooth", touchAction: "pan-y", overscrollBehaviorX: "none" }}
        >
          {/* Slide 0: Intro */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative overflow-hidden" style={{ backgroundColor: SLIDES[0].bg, color: SLIDES[0].text }}>
            <div className="absolute top-6 left-6 text-sm font-bold tracking-widest opacity-80 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-[#1DB954]" />
              </div>
              WRAPPED
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-sans font-bold mb-4 tracking-tight opacity-90">Hey {CONFIG.herName}.</h2>
              <h1 className="text-7xl font-black leading-[0.85] tracking-tighter uppercase mb-6">
                3 YEARS.
              </h1>
              <p className="text-2xl font-bold opacity-90">Swipe up for your Wrapped.</p>
            </motion.div>

            {/* Overlapping color blocks animation */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
              className="absolute bottom-0 left-0 w-full bg-[#FF007F] z-0 mix-blend-overlay"
              style={{ originY: 1 }}
            />
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1, delay: 0.7, ease: "circOut" }}
              className="absolute bottom-0 right-0 w-1/2 bg-[#4A00FF] z-0 mix-blend-overlay"
              style={{ originY: 1 }}
            />
          </div>

          {/* Slide 1: Days */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[1].bg, color: SLIDES[1].text }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-2 opacity-80">You two have been together for</h2>
              <div className="text-8xl font-black tracking-tighter my-4 drop-shadow-[0_0_30px_rgba(0,255,196,0.3)]">
                <AnimatedCounter value={daysTogether} active={activeSlide === 1} />
              </div>
              <h2 className="text-4xl font-bold leading-none">incredible days.</h2>
            </motion.div>
          </div>

          {/* Slide 2: Top Songs */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[2].bg, color: SLIDES[2].text }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold opacity-70 mb-2 tracking-widest uppercase">Your Top Songs</h2>
              <h1 className="text-5xl font-black tracking-tighter mb-8 leading-none">The soundtrack to us.</h1>
              
              <div className="flex flex-col gap-4">
                {CONFIG.topSongs.map((song, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 text-2xl font-bold opacity-50">#{i + 1}</div>
                    <img src={song.cover} alt={song.title} className="w-14 h-14 object-cover rounded-sm shadow-md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate">{song.title}</div>
                      <div className="text-sm opacity-60 truncate">{song.artist}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 3: Top Artists */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[3].bg, color: SLIDES[3].text }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold opacity-70 mb-2 tracking-widest uppercase">Top Artists</h2>
              <h1 className="text-5xl font-black tracking-tighter mb-8 leading-none">Our favorite eras.</h1>
              
              <div className="flex flex-col gap-5">
                {CONFIG.topArtists.map((artist, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 + 0.2, type: "spring" }}
                    className="flex items-center gap-4"
                  >
                    <div className="text-xl font-bold w-6 opacity-50">{i + 1}</div>
                    <img src={artist.image} alt={artist.name} className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/20" />
                    <div className="flex-1">
                      <div className="font-bold text-xl">{artist.name}</div>
                      <div className="text-sm opacity-70">{artist.streams} streams</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 4: Now Playing Card */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[4].bg, color: SLIDES[4].text }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-full bg-[#282828] rounded-3xl p-6 shadow-2xl flex flex-col items-center border border-white/10"
            >
              <h2 className="text-white/60 text-sm font-bold uppercase tracking-widest mb-8 self-start">Now Playing</h2>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="relative w-48 h-48 mb-8 rounded-full border-[12px] border-black shadow-xl overflow-hidden"
              >
                <img src={CONFIG.nowPlaying.cover} alt="vinyl" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#121212] rounded-full border-2 border-[#282828]" />
              </motion.div>

              <div className="w-full text-center mb-6">
                <h3 className="text-3xl font-bold text-white mb-2">{CONFIG.nowPlaying.song}</h3>
                <p className="text-white/60 text-lg">{CONFIG.nowPlaying.artist}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full flex flex-col gap-2 mb-6">
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-[#1DB954]"
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 font-bold">
                  <span>2:14</span>
                  <span>-0:46</span>
                </div>
              </div>

              {/* Equalizer */}
              <div className="flex items-end justify-center gap-1 h-8 w-full">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.3, 1, 0.4, 0.8, 0.3] }}
                    transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    className="w-2 bg-[#1DB954] rounded-t-sm origin-bottom"
                    style={{ height: "100%" }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 5: Sound Town */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative overflow-hidden" style={{ backgroundColor: SLIDES[5].bg, color: SLIDES[5].text }}>
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
              <img src={CONFIG.soundTown.bg} alt="City" className="w-full h-full object-cover blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 text-center"
            >
              <h2 className="text-2xl font-bold mb-4 opacity-80 uppercase tracking-widest">Sound Town</h2>
              <div className="text-6xl font-black leading-none mb-6 drop-shadow-xl">{CONFIG.soundTown.city}</div>
              <p className="text-xl font-medium opacity-90 drop-shadow-md">
                {CONFIG.soundTown.description}
              </p>
            </motion.div>
          </div>

          {/* Slide 6: Polaroids */}
          <PolaroidsSlide bg={SLIDES[6].bg} text={SLIDES[6].text} photos={CONFIG.photos} />

          {/* Marquee transition */}
          <div className="w-full snap-center snap-always py-12 shrink-0 bg-[#1DB954] text-black overflow-hidden flex items-center">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap flex text-5xl font-black uppercase tracking-tighter"
            >
              {[...Array(4)].map((_, i) => (
                <span key={i} className="mx-4">
                  3 YEARS • OUR WRAPPED • {CONFIG.herName.toUpperCase()} & {CONFIG.yourName.toUpperCase()} • 
                </span>
              ))}
            </motion.div>
          </div>

          {/* Stats Slides 7-9 */}
          {CONFIG.stats.map((stat, i) => (
            <div key={i} className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[7 + i].bg, color: SLIDES[7 + i].text }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4 opacity-80 uppercase tracking-wide">{stat.label}</h2>
                <div className="text-[5.5rem] font-black tracking-tighter leading-[0.85] break-all my-6 drop-shadow-lg">
                  <AnimatedCounter value={stat.value} duration={2.5} active={activeSlide === 7 + i} />
                </div>
                <h2 className="text-2xl font-bold">{stat.punchline}</h2>
              </motion.div>
            </div>
          ))}

          {/* Slide 10: Moments */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[10].bg, color: SLIDES[10].text }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col justify-center"
            >
              <h1 className="text-6xl font-black mb-12 tracking-tighter uppercase leading-none">Top 5 Memories</h1>
              <div className="flex flex-col gap-6">
                {CONFIG.topMoments.map((moment, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-4xl font-black opacity-40">{i + 1}</span>
                    <span className="text-2xl font-bold leading-tight">{moment}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 11: Habits */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[11].bg, color: SLIDES[11].text }}>
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-black mb-8 tracking-tighter leading-none">Your Top Habits:</h2>
              <div className="space-y-6">
                {CONFIG.habits.map((habit, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.3 }}
                    className="bg-[#282828] p-6 rounded-3xl border border-white/5"
                  >
                    <p className="text-2xl font-bold text-white">{habit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 12: Quiet */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center items-center text-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[12].bg, color: SLIDES[12].text }}>
             <motion.div
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/10 to-transparent pointer-events-none"
             />
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5 }}
            >
              <p className="text-4xl font-sans italic font-medium leading-relaxed max-w-sm opacity-90">
                But mostly, it's just about being with you.
              </p>
            </motion.div>
          </div>

          {/* Slide 13: Achievements Unlocked */}
          <AchievementsSlide bg={SLIDES[13].bg} text={SLIDES[13].text} achievements={CONFIG.achievements} onComplete={triggerConfetti} />

          {/* Slide 14: Finale */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[14].bg, color: SLIDES[14].text }}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col h-full justify-between py-12"
            >
              <div>
                <div className="flex items-center gap-2 mb-8">
                   <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                     <div className="w-3 h-3 rounded-full bg-[#1DB954]" />
                   </div>
                   <span className="font-bold tracking-widest text-sm text-black">WRAPPED</span>
                </div>
                
                <h1 className="text-6xl font-black tracking-tighter mb-8 uppercase text-black">
                  Happy 3 Years.
                </h1>
                <p className="text-2xl font-bold leading-relaxed mb-8 text-black/80">
                  {CONFIG.closingMessage}
                </p>
                <p className="text-xl font-bold text-black/50">— {CONFIG.yourName}</p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button 
                  onClick={triggerConfetti}
                  className="w-full h-16 text-xl font-bold rounded-full bg-black text-white hover:bg-[#282828] shadow-2xl border-none tracking-wide"
                >
                  Tap to celebrate
                </Button>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
