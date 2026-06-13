import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hls from "hls.js";
import {
  ArrowRight,
  Check,
  Globe,
  Mail,
  Sparkles,
  MonitorSmartphone,
  Code2,
  Palette,
} from "lucide-react";

type Page = "home" | "work" | "services" | "contact";

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

      return () => hls.destroy();
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
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}

function Navbar({
  page,
  setPage,
}: {
  page: Page;
  setPage: (page: Page) => void;
}) {
  const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Work", page: "work" },
    { label: "Services", page: "services" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 px-4 md:px-6 py-6 w-full"
    >
      <div className="liquid-glass rounded-full px-5 md:px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Globe className="w-6 h-6 text-white" />
          <span className="text-white font-semibold text-lg">KVL</span>
        </button>

        <div className="hidden md:flex items-center gap-8 text-white/75 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`hover:text-white transition-colors duration-300 cursor-pointer ${
                page === item.page ? "text-white" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage("contact")}
          className="liquid-glass rounded-full px-5 md:px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          Start Project
        </button>
      </div>
    </motion.nav>
  );
}

function EmailCTA() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (!showForm) return;

    const text = submitted
      ? "Thanks — I will get back to you soon"
      : "Enter your email to start a project";

    setPlaceholder("");

    let index = 0;

    const interval = window.setInterval(() => {
      setPlaceholder(text.slice(0, index + 1));
      index++;

      if (index >= text.length) window.clearInterval(interval);
    }, 45);

    return () => window.clearInterval(interval);
  }, [showForm, submitted]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    window.setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setPlaceholder("");
    }, 3500);
  }

  return (
    <div className="min-h-[50px] mt-2 flex justify-center">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.button
            key="button"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowForm(true)}
            className="px-10 py-3 text-[14px] font-medium border border-white/15 rounded-full hover:border-white/35 hover:bg-white/[0.04] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
          >
            Start a project
          </motion.button>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.03] backdrop-blur-sm w-full max-w-[340px] focus-within:border-white/40 transition-colors duration-300"
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
    </div>
  );
}

function HomePage({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <PageWrap>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
      >
        KVL DIGITAL EXPERIENCES
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ fontFamily: "'Instrument Serif', serif" }}
        className="text-4xl md:text-[68px] font-medium tracking-[-0.02em] leading-[1.05] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-5xl"
      >
        Creative websites, apps and digital products
        <br className="hidden md:block" /> built for modern brands
      </motion.h1>

      <EmailCTA />

      <button
        onClick={() => setPage("work")}
        className="mt-8 text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide cursor-pointer"
      >
        View My Work
      </button>
    </PageWrap>
  );
}

function WorkPage() {
  return (
    <PageWrap>
      <PageTitle
        label="Selected Work"
        title="Clean, fast and modern digital projects"
      />

      <div className="grid md:grid-cols-3 gap-4 w-full max-w-5xl">
        {[
          "Portfolio Websites",
          "Landing Pages",
          "Event & Brand Sites",
        ].map((item) => (
          <div
            key={item}
            className="liquid-glass rounded-3xl p-6 text-left min-h-[160px]"
          >
            <Sparkles className="w-6 h-6 mb-8 text-white" />
            <h3 className="text-white text-xl font-semibold mb-2">{item}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium responsive builds with smooth motion, sharp layout and
              modern visual direction.
            </p>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

function ServicesPage() {
  return (
    <PageWrap>
      <PageTitle
        label="Services"
        title="Web design, development and creative direction"
      />

      <div className="grid md:grid-cols-3 gap-4 w-full max-w-5xl">
        <ServiceCard
          icon={<Palette />}
          title="Design"
          text="Modern UI design, landing page layouts, brand-focused visuals and responsive structure."
        />
        <ServiceCard
          icon={<Code2 />}
          title="Development"
          text="React, Vite, Tailwind, animations, GitHub Pages deployment and performance setup."
        />
        <ServiceCard
          icon={<MonitorSmartphone />}
          title="Digital Products"
          text="Websites, portfolios, app concepts, event pages and creative online experiences."
        />
      </div>
    </PageWrap>
  );
}

function ContactPage() {
  return (
    <PageWrap>
      <PageTitle label="Contact" title="Let’s build your next digital project" />

      <div className="liquid-glass rounded-3xl p-6 md:p-8 w-full max-w-xl text-center">
        <Mail className="w-7 h-7 mx-auto mb-5 text-white" />

        <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6">
          For websites, landing pages, portfolio builds or digital design work,
          contact KVL directly.
        </p>

        <a
          href="mailto:hello@kvl.app"
          className="inline-flex items-center justify-center rounded-full bg-white text-black px-7 py-3 text-sm font-semibold hover:bg-white/85 transition-colors"
        >
          Email hello@kvl.app
        </a>
      </div>
    </PageWrap>
  );
}

function ServiceCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="liquid-glass rounded-3xl p-6 text-left min-h-[190px]">
      <div className="w-6 h-6 mb-8 text-white">{icon}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function PageTitle({ label, title }: { label: string; title: string }) {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/75 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
      >
        {label}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ fontFamily: "'Instrument Serif', serif" }}
        className="text-4xl md:text-[58px] font-medium tracking-[-0.02em] leading-[1.05] mb-10 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
      >
        {title}
      </motion.h1>
    </>
  );
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35 }}
      className="relative flex-1 flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        {children}
      </div>
    </motion.section>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Page;

    if (["home", "work", "services", "contact"].includes(hash)) {
      setPage(hash);
    }
  }, []);

  function changePage(nextPage: Page) {
    setPage(nextPage);
    window.history.pushState(null, "", `#${nextPage}`);
  }

  return (
    <main className="relative bg-black h-screen w-screen flex flex-col overflow-hidden selection:bg-white selection:text-black shrink-0">
      <BackgroundVideo />
      <Navbar page={page} setPage={changePage} />

      <AnimatePresence mode="wait">
        {page === "home" && <HomePage key="home" setPage={changePage} />}
        {page === "work" && <WorkPage key="work" />}
        {page === "services" && <ServicesPage key="services" />}
        {page === "contact" && <ContactPage key="contact" />}
      </AnimatePresence>
    </main>
  );
}
