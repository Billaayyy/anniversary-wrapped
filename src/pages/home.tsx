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
import album6 from "@/assets/images/album-6.png";

import artist1 from "@/assets/images/artist-1.png";
import artist2 from "@/assets/images/artist-2.png";
import artist3 from "@/assets/images/artist-3.png";
import artist4 from "@/assets/images/artist-4.png";
import artist5 from "@/assets/images/artist-5.png";

import soundTownBg from "@/assets/images/sound-town.png";

import houseAudio from "@/assets/audio/house.mp3";
import chicagoAudio from "@/assets/audio/chicago.mp3";
import ollgAudio from "@/assets/audio/ollg.mp3";

import photo1 from "@/assets/images/photo1.png";
import photo2 from "@/assets/images/photo2.png";
import photo3 from "@/assets/images/photo3.png";
import photo4 from "@/assets/images/photo4.png";
import photo5 from "@/assets/images/photo5.png";
import photo6 from "@/assets/images/photo6.png";

// ============================================================================
// 💝 EDIT THESE VARIABLES TO PERSONALIZE THE WRAPPED EXPERIENCE
// ============================================================================
const CONFIG = {
  herName: "Jena",
  yourName: "Billy",
  anniversaryDate: "2023-04-25", // YYYY-MM-DD
  
  // Slide 2: Top Songs (Title + Artist)
  topSongs: [
    { title: "Chicago", artist: "Michael Jackson", cover: album1 },
    { title: "Risk it All", artist: "Bruno Mars", cover: album2 },
    { title: "Hotel Room Service", artist: "Pitbull", cover: album3 },
    { title: "Beauty And A Beat", artist: "Justin Bieber, Nicki Minaj", cover: album4 },
    { title: "Chocolate High", artist: "India.Arie", cover: album5 },
  ],

  // Slide 3: Top Artists (Moods/Seasons of the relationship)
  topArtists: [
    { name: "Present :)", streams: "8,402", image: artist5 }, 
    { name: "It's 2025 already!", streams: "6,210", image: artist4 },
    { name: "2024 stuff", streams: "5,930", image: artist3 },
    { name: "1st year end", streams: "4,105", image: artist2 },
    { name: "The first 1 Week", streams: "3,890", image: artist1 }
  ],

  // Slide 4: Now Playing
  nowPlaying: {
    song: "One Less Lonely Girl",
    artist: "Because you are my OLLG",
    cover: album6
  },

  // Slide 5: Sound Town
  soundTown: {
    city: "Paris, France",
    description: "Your love sounds like golden hours along the Seine and midnight crepes.",
    bg: soundTownBg
  },

  // Slide 6: Polaroids
  photos: [
    { image: photo1, caption: "The iconic photobox picture" },
    { image: photo2, caption: "Going to the Dentist together" },
    { image: photo3, caption: "Xixixixixixi <3" },
    { image: photo4, caption: "Muach muach time" },
    { image: photo5, caption: "What da girl doin?" },
    { image: photo6, caption: "The first ever ride home." },
  ],

  // Slides 7-9: Stats
  stats: [
    { label: "Texts sent saying 'I Love You'", value: 14205, punchline: "And I meant it every single time." },
    { label: "Reels & YT Shorts shared", value: 38491, punchline: "Mostly cats, cars, cute things and recipes that i said i can make that, but i can't." },
    { label: "Kilometers traveled together", value: 18765, punchline: "And I'd walk 10,000 more just to see you smile." },
  ],

  topMoments: [
    "Goofing around",
    "Camping on (RV There Yet?)",
    "The hair bangs incident",
    "Moving in to new house",
    "Every lazy weekend hangout",
  ],
  loveSoundsLike: "Late night drives, early morning coffees, and uncontrollable laughter.",
  habits: [
    "Scratching my hands",
    "Sending 1000+ Reels a day",
    "Saying 'Cina' to my face",
  ],
  closingMessage: "To my favorite person. Thank you for the best 3 years of my life. Here's to a lifetime more.",

  // Slide: Achievements unlocked together (checklist)
  achievements: [
    "Survived Covid-19",
    "Tackle every downs to enjoy the ups", //change it idk with what
    "Built a thousand inside jokes",
    "Learned every one of each other's attack moves",
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

// Shuffled image pools for the share screen background columns
const SHARE_COL_A = [photo1, artist3, photo4, artist1, photo6, artist5, photo2, artist2];
const SHARE_COL_B = [artist4, photo3, artist2, photo5, artist1, photo1, artist3, photo6];
const SHARE_COL_C = [photo2, artist5, photo3, artist4, photo1, artist3, photo5, artist2];

function ShareBgColumn({ images, cssClass, rotate }: {
  images: string[];
  cssClass: string;
  rotate: number;
}) {
  const doubled = [...images, ...images];
  return (
    <div className="relative h-full overflow-hidden">
      <div className={`flex flex-col gap-2 absolute top-0 left-0 right-0 ${cssClass}`} style={{ willChange: "transform" }}>
        {doubled.map((src, i) => (
          <div
            key={i}
            className="bg-white p-1.5 pb-5 shadow-lg shrink-0"
            style={{ transform: `rotate(${i % 2 === 0 ? rotate : -rotate}deg)` }}
          >
            <img src={src} alt="" loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareScreen({ daysTogether, onClose, onRestart }: { daysTogether: number; onClose: () => void; onRestart: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const buildImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 1080, H = 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background
    const bg = ctx.createLinearGradient(0, H, W, 0);
    bg.addColorStop(0,   '#0A1A0F');
    bg.addColorStop(0.5, '#121212');
    bg.addColorStop(1,   '#1a1a2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Green glow — top-left
    const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 500);
    g1.addColorStop(0, 'rgba(29,185,84,0.45)');
    g1.addColorStop(1, 'rgba(29,185,84,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    // Pink glow — bottom-right
    const g2 = ctx.createRadialGradient(W, H, 0, W, H, 540);
    g2.addColorStop(0, 'rgba(255,0,127,0.3)');
    g2.addColorStop(1, 'rgba(255,0,127,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'left';

    // Logo dot
    ctx.fillStyle = '#1DB954';
    ctx.beginPath();
    ctx.arc(80, 88, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(80, 88, 10, 0, Math.PI * 2);
    ctx.fill();

    // WRAPPED
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('WRAPPED', 120, 100);

    // Big number
    ctx.font = 'bold 320px system-ui, sans-serif';
    ctx.fillText('3', 50, 520);

    // YEARS
    ctx.fillStyle = '#1DB954';
    ctx.font = 'bold 110px system-ui, sans-serif';
    ctx.fillText('YEARS', 60, 640);

    // Names
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.fillText(`${CONFIG.herName} & ${CONFIG.yourName}`, 60, 728);

    // Divider
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(60, 758, W - 120, 2);

    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText(`${daysTogether.toLocaleString()} days together`, 60, 828);

    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '36px system-ui, sans-serif';
    ctx.fillText(`#1 Song: ${CONFIG.topSongs[0].title}`, 60, 882);
    ctx.fillText(`Sound Town: ${CONFIG.soundTown.city}`, 60, 934);

    // Bottom divider
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(60, 964, W - 120, 2);

    // Date
    const since = new Date(CONFIG.anniversaryDate).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '26px system-ui, sans-serif';
    ctx.fillText(`Together since ${since}`, 60, 1014);

    // Branding
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('Anniversary Wrapped', W - 60, 1058);
  };

  const handleSave = () => {
    buildImage();
    const link = document.createElement('a');
    link.download = 'anniversary-wrapped.png';
    link.href = canvasRef.current!.toDataURL('image/png');
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeIn' }}
      className="absolute inset-0 z-[100] flex flex-col overflow-hidden bg-black"
    >
      {/* ── Scrolling photo background ── */}
      <div className="absolute inset-0 flex gap-2 opacity-35 pointer-events-none px-1">
        <div className="flex-1"><ShareBgColumn images={SHARE_COL_A} cssClass="share-scroll-up-mid"    rotate={3} /></div>
        <div className="flex-1"><ShareBgColumn images={SHARE_COL_B} cssClass="share-scroll-down-slow" rotate={2} /></div>
        <div className="flex-1"><ShareBgColumn images={SHARE_COL_C} cssClass="share-scroll-up-fast"   rotate={4} /></div>
      </div>

      {/* Dark gradient overlay so text is readable */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)"
      }} />

      {/* Ambient colour glows on top of photos */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#1DB954]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#FF007F]/20 blur-3xl pointer-events-none" />

      {/* Card content */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.35, ease: 'easeOut' }}
        className="flex-1 flex flex-col justify-between p-8 pt-14 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <span className="text-white font-black tracking-[0.35em] text-xs drop-shadow">WRAPPED</span>
        </div>

        {/* Hero */}
        <div className="-mt-2">
          <div className="text-[9rem] font-black leading-none text-white tracking-tighter drop-shadow-2xl">3</div>
          <div className="text-[3rem] font-black leading-none text-[#1DB954] tracking-tighter -mt-3 drop-shadow-xl">YEARS</div>
          <div className="mt-5 text-xl font-bold text-white/90 drop-shadow">{CONFIG.herName} & {CONFIG.yourName}</div>
        </div>

        {/* Stats grid — frosted glass card */}
        <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-2xl font-black text-white">{daysTogether.toLocaleString()}</div>
              <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mt-0.5">Days Together</div>
            </div>
            <div>
              <div className="text-base font-black text-white leading-snug">{CONFIG.topSongs[0].title}</div>
              <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mt-0.5">#1 Song</div>
            </div>
            <div>
              <div className="text-base font-black text-[#1DB954] leading-snug">{CONFIG.soundTown.city}</div>
              <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mt-0.5">Sound Town</div>
            </div>
            <div>
              <div className="text-base font-black text-white leading-snug">{CONFIG.topMoments[0]}</div>
              <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mt-0.5">Top Memory</div>
            </div>
          </div>
          <div className="h-px bg-white/10" />
          <p className="text-xs text-white/35 font-medium">
            Together since {new Date(CONFIG.anniversaryDate).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 h-14 rounded-full bg-[#1DB954] text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1DB954]/30 active:scale-95 transition-transform"
          >
            <span>↓</span> Save Image
          </button>
          <button
            onClick={onRestart}
            className="flex-1 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            ↺ Start Over
          </button>
        </div>
      </motion.div>

      {/* Hidden canvas used for image generation */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // ── Audio ──────────────────────────────────────────────────────────────────
  const houseRef   = useRef<HTMLAudioElement | null>(null);
  const chicagoRef = useRef<HTMLAudioElement | null>(null);
  const ollgRef    = useRef<HTMLAudioElement | null>(null);
  const fadeTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevSlide      = useRef<number>(0);
  const houseUnlocked  = useRef(false);

  // Create audio objects once on mount — do NOT call play() here, mobile blocks it
  useEffect(() => {
    const house   = new Audio(houseAudio);
    const chicago = new Audio(chicagoAudio);
    const ollg    = new Audio(ollgAudio);
    house.loop = chicago.loop = ollg.loop = true;
    house.volume = 0;
    chicago.volume = 0;
    ollg.volume = 0;
    houseRef.current   = house;
    chicagoRef.current = chicago;
    ollgRef.current    = ollg;
    return () => { house.pause(); chicago.pause(); ollg.pause(); };
  }, []);

  // React to slide changes
  useEffect(() => {
    const prev = prevSlide.current;
    prevSlide.current = activeSlide;

    const house   = houseRef.current;
    const chicago = chicagoRef.current;
    const ollg    = ollgRef.current;
    if (!house || !chicago || !ollg) return;

    const clearFade = () => {
      if (fadeTimer.current) { clearInterval(fadeTimer.current); fadeTimer.current = null; }
    };

    const fadeIn = (audio: HTMLAudioElement, target = 0.8, ms = 1500) => {
      clearFade();
      audio.volume = 0;
      audio.play().catch(() => {});
      const steps = 30;
      let step = 0;
      fadeTimer.current = setInterval(() => {
        step++;
        audio.volume = Math.min(target, (target / steps) * step);
        if (step >= steps) clearFade();
      }, ms / steps);
    };

    const fadeOut = (audio: HTMLAudioElement, ms = 700, onDone?: () => void) => {
      clearFade();
      const start = audio.volume;
      const steps = 20;
      let step = 0;
      fadeTimer.current = setInterval(() => {
        step++;
        audio.volume = Math.max(0, start - (start / steps) * step);
        if (step >= steps) {
          clearFade();
          audio.pause();
          onDone?.();
        }
      }, ms / steps);
    };

    if (activeSlide === 2) {
      if (!ollg.paused) ollg.pause();
      house.pause();
      chicago.currentTime = 24; // 0:00:24
      fadeIn(chicago);
    } else if (activeSlide === 4) {
      if (!chicago.paused) { chicago.pause(); }
      house.pause();
      ollg.currentTime = 0.56;
      fadeIn(ollg);
    } else {
      const resumeHouse = () => { house.volume = 0.75; house.play().catch(() => {}); };
      if (prev === 2 && !chicago.paused) {
        fadeOut(chicago, 700, resumeHouse);
      } else if (prev === 4 && !ollg.paused) {
        fadeOut(ollg, 700, resumeHouse);
      } else {
        if (!chicago.paused) chicago.pause();
        if (!ollg.paused) ollg.pause();
        if (house.paused) resumeHouse();
      }
    }
  }, [activeSlide]);
  // ──────────────────────────────────────────────────────────────────────────

  // ── Share screen ───────────────────────────────────────────────────────────
  const [showShare, setShowShare] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const FINALE = SLIDES.length - 1;
    if (activeSlide !== FINALE) {
      setShowShare(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const arm = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setShowShare(true), 10000);
    };

    arm();
    window.addEventListener('mousemove', arm);
    window.addEventListener('touchstart', arm, { passive: true } as any);
    window.addEventListener('touchmove', arm, { passive: true } as any);
    window.addEventListener('keydown', arm);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', arm);
      window.removeEventListener('touchstart', arm);
      window.removeEventListener('touchmove', arm);
      window.removeEventListener('keydown', arm);
    };
  }, [activeSlide]);
  // ──────────────────────────────────────────────────────────────────────────

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    setActiveSlide(index);

    // First scroll is a real user gesture — mobile Safari allows play() here
    const house = houseRef.current;
    if (house && !houseUnlocked.current && index !== 2 && index !== 4) {
      houseUnlocked.current = true;
      house.volume = 0;
      house.play().then(() => {
        let s = 0;
        const t = setInterval(() => {
          s++;
          house.volume = Math.min(0.75, (0.75 / 30) * s);
          if (s >= 30) clearInterval(t);
        }, 1500 / 30);
      }).catch(() => {});
    }
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
        
        {/* Share Screen */}
        <AnimatePresence>
          {showShare && (
            <ShareScreen
              daysTogether={daysTogether}
              onClose={() => setShowShare(false)}
              onRestart={() => {
                setShowShare(false);
                containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </AnimatePresence>

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

        {/* Global Floating Elements — static to avoid blur+JS animation on mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DB954] rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF007F] rounded-full mix-blend-screen filter blur-[100px] opacity-20" />
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
