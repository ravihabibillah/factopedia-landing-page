import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  FlaskConical,
  Landmark,
  Leaf,
  Feather,
  Telescope,
  Newspaper,
  Microscope,
  BookOpen,
  Play,
  Youtube,
  Star,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Brain,
  Eye,
  Lightbulb,
  Atom,
  TreePine,
  Waves,
  MapPin,
  Timer,
  Bell,
  Mail,
  Instagram,
  Twitter,
  Menu,
  X,
} from "lucide-react";
import { SiYoutube } from "react-icons/si";

/* ─────────────────────────── TYPES ─────────────────────────── */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

/* ─────────────────────────── PARTICLE CANVAS ─────────────────────────── */

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "hsla(191,100%,60%,",
      "hsla(210,100%,70%,",
      "hsla(45,95%,65%,",
      "hsla(270,80%,70%,",
      "hsla(142,76%,56%,",
    ];

    particlesRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      /* Draw connection lines between close particles */
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(191,100%,60%,${(1 - dist / 90) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─────────────────────────── FLOATING ICON ─────────────────────────── */

function FloatingIcon({
  icon: Icon,
  delay = 0,
  x = 0,
  y = 0,
  size = 20,
  color = "text-primary",
  duration = 5,
}: {
  icon: React.ElementType;
  delay?: number;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  duration?: number;
}) {
  return (
    <motion.div
      className={`absolute ${color} pointer-events-none select-none`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.7, 0.3],
        scale: [0.8, 1.1, 0.8],
        y: [0, -20, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon size={size} />
    </motion.div>
  );
}

/* ─────────────────────────── ANIMATED COUNTER ─────────────────────────── */

function AnimatedCounter({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────── SCROLL REVEAL ─────────────────────────── */

function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const initialMap = {
    up: { opacity: 0, y: 40 },
    down: { opacity: 0, y: -40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
    none: { opacity: 0 },
  };

  const animateMap = {
    up: { opacity: 1, y: 0 },
    down: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    none: { opacity: 1 },
  };

  return (
    <motion.div
      ref={ref}
      initial={initialMap[direction]}
      animate={inView ? animateMap[direction] : initialMap[direction]}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── NAVBAR ─────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Categories", href: "#categories" },
    { label: "Videos", href: "#videos" },
    { label: "Why Us", href: "#why" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center glow-cyan-sm">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
          </div>
          <span className="font-display font-bold text-xl text-white tracking-wide">
            Facto<span className="gradient-text-cyan">pedia</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200 rounded-md hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground gap-2 glow-cyan-sm"
            data-testid="button-subscribe-nav"
          >
            <a href="https://youtube.com/@Factopedia-ch" target="_blank" rel="noopener noreferrer">
              <SiYoutube size={14} />
              Subscribe
            </a>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden text-white"
          onClick={() => setMenuOpen((v) => !v)}
          data-testid="button-menu-mobile"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-md hover:bg-white/5"
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                size="sm"
                className="bg-primary text-primary-foreground gap-2 mt-2"
                data-testid="button-subscribe-mobile"
              >
                <a href="https://youtube.com/@Factopedia-ch" target="_blank" rel="noopener noreferrer">
                  <SiYoutube size={14} />
                  Subscribe on YouTube
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─────────────────────────── HERO SECTION ─────────────────────────── */

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const words = ["Fascinating", "Extraordinary", "Mind-Blowing", "Incredible"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      id="hero"
      data-testid="section-hero"
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[hsl(222,47%,4%)]" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 radial-glow-hero" />

      {/* Animated particle field */}
      <ParticleField />

      {/* Orbiting rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full border border-primary/8"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full border border-primary/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[1200px] h-[1200px] rounded-full border border-white/3"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating knowledge icons */}
      <FloatingIcon icon={Atom} x={8} y={20} delay={0} size={22} color="text-primary/50" duration={6} />
      <FloatingIcon icon={Globe} x={88} y={15} delay={1.2} size={24} color="text-chart-2/50" duration={7} />
      <FloatingIcon icon={FlaskConical} x={5} y={65} delay={0.8} size={20} color="text-chart-3/50" duration={5.5} />
      <FloatingIcon icon={Telescope} x={90} y={60} delay={2} size={22} color="text-chart-1/50" duration={8} />
      <FloatingIcon icon={BookOpen} x={15} y={82} delay={1.5} size={18} color="text-chart-5/50" duration={6.5} />
      <FloatingIcon icon={Microscope} x={82} y={78} delay={0.5} size={20} color="text-primary/40" duration={7.5} />
      <FloatingIcon icon={TreePine} x={50} y={90} delay={2.5} size={18} color="text-chart-5/40" duration={5} />
      <FloatingIcon icon={Brain} x={70} y={8} delay={1} size={20} color="text-chart-3/45" duration={6} />

      {/* Main content */}
      <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border-primary/30 text-primary bg-primary/8 gap-2"
            data-testid="badge-hero-tagline"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow inline-block" />
            New Fact Every Day at 9:00 AM
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-2"
          data-testid="heading-hero-title"
        >
          Discover the World's
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-2"
        >
          Most{" "}
          <span className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="gradient-text-cyan inline-block"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight"
        >
          Facts
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          Science, history, culture, animals, and world mysteries — all in one place.
          Join millions of curious minds exploring the extraordinary every day.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground gap-2.5 px-8 text-base font-semibold glow-cyan"
            data-testid="button-watch-youtube"
          >
            <a href="https://youtube.com/@Factopedia-ch" target="_blank" rel="noopener noreferrer">
              <Play size={18} fill="currentColor" />
              Watch on YouTube
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2.5 px-8 text-base font-semibold border-white/20 text-white bg-white/5 backdrop-blur-sm"
            data-testid="button-subscribe-hero"
          >
            <a href="https://youtube.com/@Factopedia-ch?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
              <Bell size={16} />
              Subscribe Now
            </a>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground/60 tracking-widest uppercase font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── STATS SECTION ─────────────────────────── */

function StatsSection() {
  const stats = [
    { value: 500, suffix: "+", label: "Videos Published", icon: Play },
    { value: 365, suffix: "", label: "Days of Facts Per Year", icon: Clock },
    { value: 50000, suffix: "+", label: "Subscribers", icon: Star },
    { value: 7, suffix: "", label: "Knowledge Categories", icon: BookOpen },
  ];

  return (
    <section className="relative py-16 overflow-hidden" data-testid="section-stats">
      <div className="absolute inset-0 bg-primary/5 border-y border-border/30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1} direction="up">
              <div
                className="text-center group"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/20 transition-all duration-300">
                    <stat.icon size={22} className="text-primary" />
                  </div>
                </div>
                <div className="font-display text-4xl sm:text-5xl font-bold gradient-text-cyan mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── ABOUT SECTION ─────────────────────────── */

function AboutSection() {
  const features = [
    { icon: Zap, label: "Daily Uploads", desc: "Fresh content every day at 9 AM" },
    { icon: Brain, label: "Research-Backed", desc: "Verified from reliable sources" },
    { icon: Eye, label: "Visual Stories", desc: "Cinematic production quality" },
    { icon: Lightbulb, label: "Fun Learning", desc: "Education that entertains" },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden" data-testid="section-about">
      <div className="absolute inset-0 radial-glow-cyan opacity-60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <ScrollReveal direction="left">
              <Badge variant="outline" className="mb-5 border-primary/30 text-primary bg-primary/8 px-3 py-1 text-xs uppercase tracking-widest">
                About Factopedia
              </Badge>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight" data-testid="heading-about">
                Where Curiosity Meets{" "}
                <span className="gradient-text-cyan">Knowledge</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Factopedia is a YouTube channel dedicated to uncovering the world's most fascinating, 
                strange, and wonderful facts. Every single day at <span className="text-primary font-semibold">9:00 AM</span>, we publish 
                a new video that takes you on a journey through science, history, animals, cultures, 
                and the mysteries of our universe.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.3}>
              <p className="text-muted-foreground text-base leading-relaxed mb-10">
                From the deepest ocean trenches to the farthest reaches of space, from ancient 
                civilizations to cutting-edge discoveries — if it's fascinating, you'll find it here.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <ScrollReveal key={f.label} delay={0.4 + i * 0.1} direction="up">
                  <div
                    className="p-4 rounded-lg bg-card border border-card-border card-glow-hover group"
                    data-testid={`card-about-feature-${i}`}
                  >
                    <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/50 transition-all duration-300">
                      <f.icon size={16} className="text-primary" />
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right: Visual Display */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative">
              {/* Main display card */}
              <div className="relative rounded-xl border border-primary/20 bg-card overflow-hidden glow-cyan">
                {/* Header bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border bg-card">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-chart-2/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-chart-5/80" />
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">factopedia.live</span>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6">
                  {/* Live badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs text-destructive font-semibold uppercase tracking-widest">Live Channel</span>
                  </div>

                  <div className="font-display text-2xl font-bold text-white mb-2">Factopedia</div>
                  <p className="text-sm text-muted-foreground mb-6">A new fact every day. No exceptions.</p>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Science", "History", "Animals", "Culture", "Space", "Nature"].map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 text-xs rounded-full border border-primary/20 text-primary/80 bg-primary/8 font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Upload schedule */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/8 border border-primary/20">
                    <Clock size={16} className="text-primary shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">Daily Upload Schedule</div>
                      <div className="text-xs text-muted-foreground">Every day at 9:00 AM</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs font-bold text-primary font-mono">09:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 bg-chart-2/20 border border-chart-2/30 rounded-lg p-3 backdrop-blur-sm"
              >
                <div className="text-chart-2 text-xs font-bold">+500 Videos</div>
                <div className="text-muted-foreground text-xs">All Categories</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-chart-5/15 border border-chart-5/25 rounded-lg p-3 backdrop-blur-sm"
              >
                <div className="text-chart-5 text-xs font-bold">50,000+</div>
                <div className="text-muted-foreground text-xs">Subscribers</div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CATEGORIES SECTION ─────────────────────────── */

function CategoriesSection() {
  const categories = [
    {
      icon: Landmark,
      name: "History",
      desc: "Ancient civilizations, forgotten empires, and events that shaped humanity",
      color: "text-chart-2",
      bg: "bg-chart-2/8",
      border: "border-chart-2/20",
      hoverBorder: "hover:border-chart-2/50",
      glow: "hover:shadow-[0_0_25px_hsla(45,95%,58%,0.15)]",
      count: "120+ videos",
    },
    {
      icon: FlaskConical,
      name: "Science",
      desc: "Breakthroughs, discoveries, and the hidden laws of the universe",
      color: "text-chart-1",
      bg: "bg-chart-1/8",
      border: "border-chart-1/20",
      hoverBorder: "hover:border-chart-1/50",
      glow: "hover:shadow-[0_0_25px_hsla(191,100%,50%,0.15)]",
      count: "150+ videos",
    },
    {
      icon: Globe,
      name: "Culture",
      desc: "Traditions, languages, customs, and what makes us uniquely human",
      color: "text-chart-3",
      bg: "bg-chart-3/8",
      border: "border-chart-3/20",
      hoverBorder: "hover:border-chart-3/50",
      glow: "hover:shadow-[0_0_25px_hsla(270,80%,68%,0.15)]",
      count: "85+ videos",
    },
    {
      icon: Feather,
      name: "Animals",
      desc: "Extraordinary creatures and the astonishing diversity of life on Earth",
      color: "text-chart-5",
      bg: "bg-chart-5/8",
      border: "border-chart-5/20",
      hoverBorder: "hover:border-chart-5/50",
      glow: "hover:shadow-[0_0_25px_hsla(142,76%,52%,0.15)]",
      count: "95+ videos",
    },
    {
      icon: Leaf,
      name: "Plants",
      desc: "The secret lives of plants — from carnivores to ancient trees",
      color: "text-chart-5",
      bg: "bg-chart-5/8",
      border: "border-chart-5/20",
      hoverBorder: "hover:border-chart-5/50",
      glow: "hover:shadow-[0_0_25px_hsla(142,76%,52%,0.15)]",
      count: "60+ videos",
    },
    {
      icon: Telescope,
      name: "World Mysteries",
      desc: "Unexplained phenomena, ancient puzzles, and secrets yet unsolved",
      color: "text-chart-4",
      bg: "bg-chart-4/8",
      border: "border-chart-4/20",
      hoverBorder: "hover:border-chart-4/50",
      glow: "hover:shadow-[0_0_25px_hsla(340,82%,66%,0.15)]",
      count: "70+ videos",
    },
    {
      icon: Newspaper,
      name: "News Facts",
      desc: "Current events explained with fascinating factual context",
      color: "text-chart-1",
      bg: "bg-chart-1/8",
      border: "border-chart-1/20",
      hoverBorder: "hover:border-chart-1/50",
      glow: "hover:shadow-[0_0_25px_hsla(191,100%,50%,0.15)]",
      count: "40+ videos",
    },
    {
      icon: Waves,
      name: "World Curiosities",
      desc: "Little-known wonders and surprising truths about our planet",
      color: "text-chart-2",
      bg: "bg-chart-2/8",
      border: "border-chart-2/20",
      hoverBorder: "hover:border-chart-2/50",
      glow: "hover:shadow-[0_0_25px_hsla(45,95%,58%,0.15)]",
      count: "55+ videos",
    },
  ];

  return (
    <section id="categories" className="relative py-24 overflow-hidden" data-testid="section-categories">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary bg-primary/8 px-3 py-1 text-xs uppercase tracking-widest">
              Content Categories
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-categories">
              Explore Every <span className="gradient-text-cyan">Corner</span> of Knowledge
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Eight carefully curated categories, each packed with stories that will change how you see the world.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={i * 0.06} direction="up">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative group p-5 rounded-xl border ${cat.border} ${cat.hoverBorder} ${cat.glow} bg-card transition-all duration-300 cursor-pointer overflow-hidden`}
                data-testid={`card-category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {/* Shimmer overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/3 to-transparent" />

                <div className={`w-10 h-10 rounded-lg ${cat.bg} border ${cat.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon size={20} className={cat.color} />
                </div>

                <h3 className="font-semibold text-white text-base mb-2 group-hover:text-primary transition-colors duration-200">{cat.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.desc}</p>

                <div className={`flex items-center gap-1.5 text-xs font-medium ${cat.color} opacity-70`}>
                  <Play size={10} fill="currentColor" />
                  {cat.count}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── VIDEO CARD ─────────────────────────── */

function VideoCard({
  title,
  category,
  views,
  duration,
  daysAgo,
  videoId,
  index,
}: {
  title: string;
  category: string;
  views: string;
  duration: string;
  daysAgo: number;
  videoId: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal delay={index * 0.1} direction="up">
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group rounded-xl border border-card-border bg-card card-glow-hover overflow-hidden"
        data-testid={`card-video-${index}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded font-medium">
            {duration}
          </div>

          {/* Play overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-cyan"
                  data-testid={`button-play-video-${index}`}
                >
                  <Play size={20} fill="white" className="text-primary-foreground ml-1" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-4">
          <Badge
            variant="outline"
            className="mb-2 text-xs border-primary/25 text-primary bg-primary/8 px-2 py-0.5"
          >
            {category}
          </Badge>
          <h3
            className="font-semibold text-white text-sm leading-snug mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2"
            data-testid={`text-video-title-${index}`}
          >
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{views} views</span>
            </div>
            <span>{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─────────────────────────── VIDEOS SECTION ─────────────────────────── */

function VideosSection() {
  const videos = [
    {
      title: "Why Do Cats Always Land on Their Feet? The Physics Is Incredible",
      category: "Animals",
      views: "42K",
      duration: "8:24",
      daysAgo: 0,
      videoId: "RtWbpyjJqrU",
    },
    {
      title: "The Lost City of Atlantis — What Do We Actually Know?",
      category: "World Mysteries",
      views: "89K",
      duration: "11:15",
      daysAgo: 1,
      videoId: "nVUJqJIEkFI",
    },
    {
      title: "How Black Holes Actually Distort Time — Einstein Was Right",
      category: "Science",
      views: "130K",
      duration: "9:52",
      daysAgo: 2,
      videoId: "e-P5IFTqB98",
    },
    {
      title: "The Ancient Roman Road Network Was More Advanced Than We Thought",
      category: "History",
      views: "67K",
      duration: "10:08",
      daysAgo: 3,
      videoId: "oJEUFMB5zEo",
    },
    {
      title: "The Most Dangerous Plant in the World — And It's Everywhere",
      category: "Plants",
      views: "55K",
      duration: "7:38",
      daysAgo: 4,
      videoId: "4Q5VkqSH8T0",
    },
    {
      title: "How the Moon Is Slowly Drifting Away From Earth",
      category: "Science",
      views: "98K",
      duration: "12:01",
      daysAgo: 5,
      videoId: "9TS6b7nYoY8",
    },
  ];

  return (
    <section id="videos" className="relative py-24 overflow-hidden" data-testid="section-videos">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary bg-primary/8 px-3 py-1 text-xs uppercase tracking-widest">
              Latest Videos
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-videos">
              Fresh <span className="gradient-text-cyan">Facts</span> Every Day
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our latest discoveries — each video is a journey into something extraordinary.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <VideoCard key={v.title} {...v} index={i} />
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.4}>
          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2.5 border-primary/30 text-primary bg-primary/8 px-8 text-base"
              data-testid="button-view-all-videos"
            >
              <a href="https://youtube.com/@Factopedia-ch/videos" target="_blank" rel="noopener noreferrer">
                <SiYoutube size={16} />
                View All Videos on YouTube
                <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── WHY WATCH SECTION ─────────────────────────── */

function WhyWatchSection() {
  const reasons = [
    {
      icon: Clock,
      title: "Daily New Content",
      desc: "A brand new fascinating fact drops every single day at 9:00 AM — no gaps, no exceptions.",
      highlight: "365 days/year",
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      icon: CheckCircle,
      title: "Reliable Information",
      desc: "Every fact is carefully researched and cross-referenced with credible scientific and historical sources.",
      highlight: "Fact-checked",
      color: "text-chart-5",
      bg: "bg-chart-5/10",
    },
    {
      icon: Sparkles,
      title: "Stunning Visuals",
      desc: "Cinematic-quality production with custom animations, infographics, and beautiful storytelling.",
      highlight: "HD Quality",
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      icon: Zap,
      title: "Short & Engaging",
      desc: "Each video is optimized for maximum information density — perfect for busy learners.",
      highlight: "5–15 minutes",
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      desc: "Stories from every continent, every era, and every corner of the natural world.",
      highlight: "World-spanning",
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      icon: Brain,
      title: "Fun Storytelling",
      desc: "Complex topics explained simply, with humor, wonder, and narrative that keeps you hooked.",
      highlight: "Always engaging",
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
  ];

  return (
    <section id="why" className="relative py-24 overflow-hidden" data-testid="section-why-watch">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chart-3/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary bg-primary/8 px-3 py-1 text-xs uppercase tracking-widest">
              Why Factopedia
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-why-watch">
              Six Reasons to <span className="gradient-text-cyan">Subscribe</span> Today
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Thousands of curious minds already chose Factopedia as their daily dose of wonder. Here's why.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.08} direction="up">
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative group p-6 rounded-xl border border-card-border bg-card card-glow-hover"
                data-testid={`card-why-${i}`}
              >
                <div className={`w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <r.icon size={22} className={r.color} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{r.desc}</p>
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${r.color} px-2.5 py-1 rounded-full ${r.bg} border border-current/20`}>
                  <CheckCircle size={10} />
                  {r.highlight}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── COUNTDOWN SECTION ─────────────────────────── */

function CountdownSection() {
  const getNextUploadTime = useCallback(() => {
    const now = new Date();
    const next = new Date();
    next.setHours(9, 0, 0, 0);
    if (now >= next) next.setDate(next.getDate() + 1);
    return next;
  }, []);

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = getNextUploadTime();
      const diff = Math.max(0, next.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [getNextUploadTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative py-24 overflow-hidden" data-testid="section-countdown">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-primary/5 to-background" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal direction="up">
          <div className="mb-3 flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center glow-cyan-sm">
              <Timer size={24} className="text-primary" />
            </div>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 mt-6" data-testid="heading-countdown">
            Next Fact Drops In
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            New video every day at <span className="text-primary font-semibold">9:00 AM</span> — set your reminder
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex items-center justify-center gap-4 sm:gap-8" data-testid="countdown-timer">
            {[
              { value: pad(timeLeft.h), label: "Hours" },
              { value: pad(timeLeft.m), label: "Minutes" },
              { value: pad(timeLeft.s), label: "Seconds" },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center">
                <div className="text-center">
                  <div className="relative w-24 sm:w-32 h-24 sm:h-32 rounded-xl border border-primary/25 bg-card flex items-center justify-center glow-cyan-sm">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={unit.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-display text-4xl sm:text-5xl font-bold gradient-text-cyan"
                        data-testid={`countdown-${unit.label.toLowerCase()}`}
                      >
                        {unit.value}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">{unit.label}</div>
                </div>
                {i < 2 && (
                  <span className="text-3xl font-bold text-primary/50 mb-6 mx-1">:</span>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground gap-2.5 px-8 text-base font-semibold glow-cyan"
              data-testid="button-set-reminder"
            >
              <a href="https://youtube.com/@Factopedia-ch?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                <Bell size={18} />
                Set Reminder — Subscribe Free
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA SECTION ─────────────────────────── */

function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden" data-testid="section-cta">
      {/* Dramatic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(191,100%,6%)] via-[hsl(222,47%,7%)] to-[hsl(222,47%,4%)]" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Radial glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-3xl" />

      {/* Orbiting rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full border border-primary/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[750px] h-[750px] rounded-full border border-primary/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal direction="up">
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center"
            >
              <SiYoutube size={36} className="text-destructive" />
            </motion.div>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight" data-testid="heading-cta">
            Join Thousands of{" "}
            <span className="gradient-text-gold">Curious Minds</span>
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Subscribe to Factopedia and never miss a fascinating fact again. 
            It's free, it's daily, and it will change how you see the world.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-destructive text-destructive-foreground gap-2.5 px-10 text-lg font-bold shadow-[0_0_30px_hsla(0,84%,42%,0.3)]"
              data-testid="button-subscribe-cta"
            >
              <a href="https://youtube.com/@Factopedia-ch?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                <SiYoutube size={20} />
                Subscribe Free on YouTube
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2.5 px-8 text-base border-primary/30 text-primary bg-primary/8 font-semibold"
              data-testid="button-watch-cta"
            >
              <a href="https://youtube.com/@Factopedia-ch/videos" target="_blank" rel="noopener noreferrer">
                <Play size={16} fill="currentColor" />
                Browse All Videos
              </a>
            </Button>
          </div>
        </ScrollReveal>

        {/* Social proof */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {[
              { value: "50K+", label: "Subscribers" },
              { value: "500+", label: "Videos" },
              { value: "4.9★", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center" data-testid={`stat-cta-${s.label.toLowerCase()}`}>
                <div className="font-display text-2xl font-bold gradient-text-cyan">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */

function Footer() {
  const categories = ["History", "Science", "Culture", "Animals", "Plants", "World Mysteries", "News Facts"];

  return (
    <footer className="relative bg-[hsl(222,47%,3%)] border-t border-border/30 pt-16 pb-8 overflow-hidden" data-testid="section-footer">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center glow-cyan-sm">
                <Sparkles size={16} className="text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-wide">
                Facto<span className="gradient-text-cyan">pedia</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Discover the world's most fascinating facts. New video every day at 9:00 AM.
              Science, history, animals, culture, and so much more.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://youtube.com/@Factopedia-ch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/15 border border-destructive/25 text-destructive text-sm font-semibold hover:bg-destructive/25 transition-colors"
                data-testid="link-footer-youtube"
              >
                <SiYoutube size={16} />
                YouTube
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-card-border text-muted-foreground text-sm hover:text-white hover:border-border transition-colors"
                data-testid="link-footer-instagram"
              >
                <Instagram size={14} />
                Instagram
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-card-border text-muted-foreground text-sm hover:text-white hover:border-border transition-colors"
                data-testid="link-footer-twitter"
              >
                <Twitter size={14} />
                Twitter
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-widest">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <a
                    href="#categories"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    data-testid={`link-footer-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-widest">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={14} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Email</div>
                  <a
                    href="mailto:hello@factopedia.com"
                    className="text-sm text-white hover:text-primary transition-colors"
                    data-testid="link-footer-email"
                  >
                    hello@factopedia.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Youtube size={14} className="text-destructive mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">YouTube Channel</div>
                  <a
                    href="https://youtube.com/@Factopedia-ch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-primary transition-colors"
                    data-testid="link-footer-channel"
                  >
                    @factopedia
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={14} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Daily Upload</div>
                  <div className="text-sm text-white">Every day at 9:00 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground" data-testid="text-copyright">
            © {new Date().getFullYear()} Factopedia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── INTERACTIVE FACT TICKER ─────────────────────────── */

function FactTicker() {
  const facts = [
    "Octopuses have three hearts and blue blood",
    "The Great Wall of China isn't visible from space",
    "Cleopatra lived closer in time to the Moon landing than to the pyramids",
    "Honey never spoils — 3,000-year-old honey was found edible in Egyptian tombs",
    "A day on Venus is longer than a year on Venus",
    "Bananas are technically berries, but strawberries are not",
    "The human body contains enough carbon to make 900 pencils",
    "Trees communicate through underground fungal networks",
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((i) => (i + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative bg-primary/8 border-y border-primary/15 py-3 overflow-hidden"
      data-testid="section-fact-ticker"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
        <div className="shrink-0 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-primary uppercase tracking-widest whitespace-nowrap">Did You Know?</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFact}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="text-sm text-muted-foreground absolute whitespace-nowrap"
              data-testid="text-fact-ticker"
            >
              {facts[currentFact]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="shrink-0 hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>{currentFact + 1}/{facts.length}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <FactTicker />
        <StatsSection />
        <AboutSection />
        <CategoriesSection />
        <VideosSection />
        <WhyWatchSection />
        <CountdownSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
