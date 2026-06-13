import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hls from "hls.js";
import { ArrowRight, Check, Globe } from "lucide-react";

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const videoUrl =
      "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 px-6 py-6 w-full"
    >
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Asme</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors duration-300">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors duration-300">
              Pricing
            </a>
            <a href="#about" className="hover:text-white transition-colors duration-300">
              About
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer">
            Sign Up
          </button>

          <button className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer">
            Login
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (!showForm) return;

    const text = submitted
      ? "You Will Receive Notifications By Email"
      : "Enter Your Email Here For Early Access";

    setPlaceholder("");

    let index = 0;

    const interval = window.setInterval(() => {
      setPlaceholder(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 60);

    return () => {
      window.clearInterval(interval);
    };
  }, [showForm, submitted]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    window.setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setPlaceholder("");
    }, 4000);
  }

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
          >
            BUILD A NO-CODE AI APP IN MINUTES
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              fontFamily: "'Instrument Serif', serif",
            }}
            className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
          >
            A new way to think and create
            <br className="hidden md:block" /> with computers
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="min-h-[50px] mt-2 flex justify-center"
          >
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.button
                  key="button"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowForm(true)}
                  className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
                >
                  Get early access
                </motion.button>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
                >
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder={placeholder}
                    className="bg-transparent outline-none text-white placeholder-white/45 flex-1 min-w-0"
                  />

                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center"
                  >
                    {submitted ? <Check size={16} /> : <ArrowRight size={16} />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          href="#"
          className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide"
        >
          Play Video Demo
        </motion.a>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="relative bg-black h-screen w-screen flex flex-col overflow-hidden selection:bg-white selection:text-black shrink-0">
      <BackgroundVideo />
      <Navbar />
      <Hero />
    </main>
  );
}
