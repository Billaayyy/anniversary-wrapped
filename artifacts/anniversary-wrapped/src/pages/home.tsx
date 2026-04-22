import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

// ============================================================================
// 💝 EDIT THESE VARIABLES TO PERSONALIZE THE WRAPPED EXPERIENCE
// ============================================================================
const CONFIG = {
  herName: "[Her Name]",
  yourName: "[Your Name]",
  anniversaryDate: "2021-04-22", // YYYY-MM-DD
  topMoments: [
    "That night in [City]",
    "Getting lost in [Place]",
    "The [Funny Event] incident",
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
};
// ============================================================================

const SLIDES = [
  { id: "intro", bg: "#FF007F", text: "#FFFFFF" },
  { id: "days", bg: "#4A00FF", text: "#00FFC4" },
  { id: "minutes", bg: "#FF4D00", text: "#FFF000" },
  { id: "sounds", bg: "#00E5FF", text: "#001AFF" },
  { id: "moments", bg: "#B500FF", text: "#FFB000" },
  { id: "habits", bg: "#FFD700", text: "#FF0055" },
  { id: "quiet", bg: "#1A1A1A", text: "#E5E5E5" },
  { id: "finale", bg: "#FFFFFF", text: "#FF007F" },
];

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

  const minutesTogether = daysTogether * 24 * 60;

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
        colors: ["#FF007F", "#4A00FF", "#00FFC4", "#FFF000"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FF007F", "#4A00FF", "#00FFC4", "#FFF000"],
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Mobile constraint wrapper */}
      <div className="w-full h-full max-w-[430px] relative bg-black overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:h-[90%] sm:my-auto sm:border-8 border-gray-900">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3 pointer-events-none">
          {SLIDES.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: activeSlide >= i ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Slide 1: Intro */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[0].bg, color: SLIDES[0].text }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-sans mb-4 tracking-tight">Hey {CONFIG.herName}.</h2>
              <h1 className="text-6xl sm:text-7xl font-display font-black leading-[0.85] tracking-tighter uppercase">
                It's been a minute.
              </h1>
              <p className="mt-8 text-xl font-medium opacity-80">Swipe up to look back.</p>
            </motion.div>
          </div>

          {/* Slide 2: Days */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[1].bg, color: SLIDES[1].text }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-2">You two have been together for</h2>
              <div className="text-8xl font-display font-black tracking-tighter my-4">
                {daysTogether.toLocaleString()}
              </div>
              <h2 className="text-4xl font-bold leading-none">incredible days.</h2>
            </motion.div>
          </div>

          {/* Slide 3: Minutes */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[2].bg, color: SLIDES[2].text }}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">That translates to</h2>
              <div className="text-[5.5rem] font-display font-black tracking-tighter leading-[0.85] break-all my-6">
                {minutesTogether.toLocaleString()}
              </div>
              <h2 className="text-2xl font-bold">minutes of driving me crazy. (In a good way.)</h2>
            </motion.div>
          </div>

          {/* Slide 4: Sounds */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[3].bg, color: SLIDES[3].text }}>
            <motion.div
              initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
              whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">Your Genre</h2>
              <h1 className="text-5xl font-display font-black leading-tight mb-8">
                "Our Love Sounds Like..."
              </h1>
              <p className="text-2xl font-medium leading-relaxed border-l-4 pl-6 border-current">
                {CONFIG.loveSoundsLike}
              </p>
            </motion.div>
          </div>

          {/* Slide 5: Moments */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[4].bg, color: SLIDES[4].text }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col justify-center"
            >
              <h1 className="text-5xl font-display font-black mb-12">Top 5 Memories</h1>
              <div className="flex flex-col gap-6">
                {CONFIG.topMoments.map((moment, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-4xl font-display font-black opacity-50">{i + 1}</span>
                    <span className="text-2xl font-bold leading-tight">{moment}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 6: Habits */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[5].bg, color: SLIDES[5].text }}>
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-display font-black mb-8">Your Top Habits:</h2>
              <div className="space-y-8">
                {CONFIG.habits.map((habit, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.3 }}
                    className="bg-black/10 p-6 rounded-3xl"
                  >
                    <p className="text-2xl font-bold">{habit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slide 7: Quiet */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center items-center text-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[6].bg, color: SLIDES[6].text }}>
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5 }}
            >
              <p className="text-3xl font-serif italic font-medium leading-relaxed max-w-sm">
                But mostly, it's just about being with you.
              </p>
            </motion.div>
          </div>

          {/* Slide 8: Finale */}
          <div className="w-full h-full snap-center snap-always flex flex-col justify-center p-8 shrink-0 relative" style={{ backgroundColor: SLIDES[7].bg, color: SLIDES[7].text }}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col h-full justify-between py-12"
            >
              <div>
                <h1 className="text-6xl font-display font-black tracking-tighter mb-8 uppercase">
                  Happy 3 Years.
                </h1>
                <p className="text-2xl font-medium leading-relaxed mb-8">
                  {CONFIG.closingMessage}
                </p>
                <p className="text-xl font-bold opacity-50">— {CONFIG.yourName}</p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={triggerConfetti}
                  className="w-full h-16 text-2xl font-bold rounded-full bg-[#FF007F] text-white hover:bg-[#D4006A] shadow-xl border-none"
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
