import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem",
        md: ".375rem",
        sm: ".1875rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
        /* Factopedia brand extras */
        cyan: {
          glow: "hsla(191, 100%, 50%, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Space Grotesk", "sans-serif"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        display: ["Oxanium", "Space Grotesk", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /* Factopedia custom animations */
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(2deg)" },
          "66%": { transform: "translateY(-6px) rotate(-1deg)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(3deg)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "particle-drift-1": {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "0.6" },
          "25%": { transform: "translate(30px, -40px) scale(1.1)", opacity: "0.9" },
          "50%": { transform: "translate(60px, -20px) scale(0.9)", opacity: "0.7" },
          "75%": { transform: "translate(30px, -60px) scale(1.1)", opacity: "0.5" },
          "100%": { transform: "translate(0, 0) scale(1)", opacity: "0.6" },
        },
        "particle-drift-2": {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
          "33%": { transform: "translate(-40px, -30px) scale(1.2)", opacity: "0.8" },
          "66%": { transform: "translate(-20px, -60px) scale(0.8)", opacity: "0.4" },
          "100%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
        },
        "particle-drift-3": {
          "0%": { transform: "translate(0, 0)", opacity: "0.3" },
          "50%": { transform: "translate(50px, 30px)", opacity: "0.7" },
          "100%": { transform: "translate(0, 0)", opacity: "0.3" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "counter-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "line-expand": {
          from: { width: "0%", opacity: "0" },
          to: { width: "100%", opacity: "1" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
          "75%": { opacity: "0.9" },
        },
        "orbit": {
          from: { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        "orbit-reverse": {
          from: { transform: "rotate(360deg) translateX(80px) rotate(-360deg)" },
          to: { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 4s ease-in-out infinite",
        "float-fast": "float-fast 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "particle-drift-1": "particle-drift-1 8s ease-in-out infinite",
        "particle-drift-2": "particle-drift-2 11s ease-in-out infinite",
        "particle-drift-3": "particle-drift-3 7s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "counter-up": "counter-up 0.6s ease-out forwards",
        "line-expand": "line-expand 1.2s ease-out forwards",
        "scan": "scan 4s linear infinite",
        "flicker": "flicker 2s ease-in-out infinite",
        "orbit": "orbit 12s linear infinite",
        "orbit-reverse": "orbit-reverse 8s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, hsla(222,47%,3%,1) 0%, hsla(222,47%,8%,0.95) 50%, hsla(191,100%,10%,0.9) 100%)",
        "card-gradient": "linear-gradient(135deg, hsla(222,40%,8%,1) 0%, hsla(191,60%,8%,0.8) 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, hsla(191,100%,70%,0.08) 50%, transparent 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
