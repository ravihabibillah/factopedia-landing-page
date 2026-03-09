import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "id" | "en";

const translations = {
  nav: {
    about: { id: "Tentang", en: "About" },
    categories: { id: "Kategori", en: "Categories" },
    videos: { id: "Video", en: "Videos" },
    whyUs: { id: "Kenapa Kami", en: "Why Us" },
    subscribe: { id: "Berlangganan", en: "Subscribe" },
    subscribeYoutube: { id: "Berlangganan di YouTube", en: "Subscribe on YouTube" },
  },
  hero: {
    badge: { id: "Fakta Baru Setiap Hari Pukul 09:00", en: "New Fact Every Day at 9:00 AM" },
    title1: { id: "Temukan Fakta", en: "Discover the World's" },
    title2: { id: "Paling", en: "Most" },
    title3: { id: "di Dunia", en: "Facts" },
    words: {
      id: ["Menakjubkan", "Luar Biasa", "Mencengangkan", "Menarik"],
      en: ["Fascinating", "Extraordinary", "Mind-Blowing", "Incredible"],
    },
    subtitle: {
      id: "Sains, sejarah, budaya, hewan, dan misteri dunia — semuanya di satu tempat. Bergabunglah dengan jutaan jiwa penasaran yang menjelajahi hal-hal luar biasa setiap hari.",
      en: "Science, history, culture, animals, and world mysteries — all in one place. Join millions of curious minds exploring the extraordinary every day.",
    },
    watchYoutube: { id: "Tonton di YouTube", en: "Watch on YouTube" },
    subscribeNow: { id: "Berlangganan Sekarang", en: "Subscribe Now" },
    scrollExplore: { id: "Gulir untuk menjelajahi", en: "Scroll to explore" },
  },
  ticker: {
    label: { id: "Tahukah Kamu?", en: "Did You Know?" },
    facts: {
      id: [
        "Gurita memiliki tiga jantung dan darah berwarna biru",
        "Tembok Besar China tidak terlihat dari luar angkasa",
        "Cleopatra hidup lebih dekat waktunya ke pendaratan di Bulan daripada ke pembangunan piramida",
        "Madu tidak pernah basi — madu berusia 3.000 tahun ditemukan masih bisa dimakan di makam Mesir",
        "Sehari di Venus lebih lama dari setahun di Venus",
        "Pisang secara teknis adalah buah beri, tapi stroberi bukan",
        "Tubuh manusia mengandung cukup karbon untuk membuat 900 pensil",
        "Pohon berkomunikasi melalui jaringan jamur bawah tanah",
      ],
      en: [
        "Octopuses have three hearts and blue blood",
        "The Great Wall of China isn't visible from space",
        "Cleopatra lived closer in time to the Moon landing than to the pyramids",
        "Honey never spoils — 3,000-year-old honey was found edible in Egyptian tombs",
        "A day on Venus is longer than a year on Venus",
        "Bananas are technically berries, but strawberries are not",
        "The human body contains enough carbon to make 900 pencils",
        "Trees communicate through underground fungal networks",
      ],
    },
  },
  stats: {
    videosPublished: { id: "Video Diterbitkan", en: "Videos Published" },
    totalViews: { id: "Total Tayangan", en: "Total Views" },
    subscribers: { id: "Pelanggan", en: "Subscribers" },
    knowledgeCategories: { id: "Kategori Pengetahuan", en: "Knowledge Categories" },
  },
  about: {
    badge: { id: "Tentang Factopedia", en: "About Factopedia" },
    heading1: { id: "Dimana Rasa Ingin Tahu Bertemu", en: "Where Curiosity Meets" },
    heading2: { id: "Pengetahuan", en: "Knowledge" },
    desc1: {
      id: "Selamat datang di Factopedia! Channel ini menyajikan fakta-fakta unik, menarik, dan inspiratif dari seluruh dunia. Dari misteri sejarah hingga keajaiban alam, dari sains hingga budaya, selalu ada hal baru yang bisa kamu pelajari di sini.",
      en: "Welcome to Factopedia! This channel presents unique, fascinating, and inspiring facts from around the world. From historical mysteries to natural wonders, from science to culture, there's always something new to learn here.",
    },
    desc2: {
      id: "Jelajahi dunia bersama kami dan temukan wawasan menarik setiap hari! Semua konten dikurasi dengan hati-hati untuk memberikan pengalaman menonton terbaik dengan nilai edukatif dan kreativitas yang tinggi.",
      en: "Explore the world with us and discover fascinating insights every day! All content is carefully curated to deliver the best viewing experience with high educational value and creativity.",
    },
    features: {
      dailyUploads: { id: "Fakta Unik", en: "Unique Facts" },
      dailyUploadsDesc: { id: "Fakta unik dan menarik dari seluruh dunia", en: "Unique and fascinating facts from around the world" },
      researchBacked: { id: "Dikurasi Cermat", en: "Carefully Curated" },
      researchBackedDesc: { id: "Konten dikurasi dengan hati-hati dan bernilai", en: "Content carefully curated with added value" },
      visualStories: { id: "Cerita Inspiratif", en: "Inspiring Stories" },
      visualStoriesDesc: { id: "Konten yang menginspirasi dan edukatif", en: "Inspiring and educational content" },
      funLearning: { id: "Belajar Seru", en: "Fun Learning" },
      funLearningDesc: { id: "Wawasan baru yang seru setiap hari", en: "Exciting new insights every day" },
    },
    channelLive: { id: "Channel Aktif", en: "Live Channel" },
    channelDesc: {
      id: "Fakta unik, menarik, dan inspiratif setiap hari.",
      en: "Unique, fascinating, and inspiring facts every day.",
    },
    dailySchedule: { id: "Jadwal Upload Harian", en: "Daily Upload Schedule" },
    dailyScheduleDesc: { id: "Setiap hari pukul 09:00", en: "Every day at 9:00 AM" },
    videos: { id: "Video", en: "Videos" },
    allCategories: { id: "Semua Kategori", en: "All Categories" },
  },
  categories: {
    badge: { id: "Kategori Konten", en: "Content Categories" },
    heading1: { id: "Jelajahi Setiap", en: "Explore Every" },
    heading2: { id: "Sudut", en: "Corner" },
    heading3: { id: "Pengetahuan", en: "of Knowledge" },
    subtitle: {
      id: "Delapan kategori yang dikurasi dengan cermat, masing-masing penuh dengan cerita yang akan mengubah cara Anda melihat dunia.",
      en: "Eight carefully curated categories, each packed with stories that will change how you see the world.",
    },
    items: {
      history: { id: "Sejarah", en: "History" },
      historyDesc: { id: "Peradaban kuno, kerajaan yang terlupakan, dan peristiwa yang membentuk umat manusia", en: "Ancient civilizations, forgotten empires, and events that shaped humanity" },
      science: { id: "Sains", en: "Science" },
      scienceDesc: { id: "Terobosan, penemuan, dan hukum tersembunyi alam semesta", en: "Breakthroughs, discoveries, and the hidden laws of the universe" },
      culture: { id: "Budaya", en: "Culture" },
      cultureDesc: { id: "Tradisi, bahasa, adat istiadat, dan apa yang membuat kita unik sebagai manusia", en: "Traditions, languages, customs, and what makes us uniquely human" },
      animals: { id: "Hewan", en: "Animals" },
      animalsDesc: { id: "Makhluk luar biasa dan keragaman kehidupan yang menakjubkan di Bumi", en: "Extraordinary creatures and the astonishing diversity of life on Earth" },
      plants: { id: "Tumbuhan", en: "Plants" },
      plantsDesc: { id: "Kehidupan rahasia tumbuhan — dari karnivora hingga pohon purba", en: "The secret lives of plants — from carnivores to ancient trees" },
      worldMysteries: { id: "Misteri Dunia", en: "World Mysteries" },
      worldMysteriesDesc: { id: "Fenomena tak terjelaskan, teka-teki kuno, dan rahasia yang belum terpecahkan", en: "Unexplained phenomena, ancient puzzles, and secrets yet unsolved" },
      newsFacts: { id: "Fakta Berita", en: "News Facts" },
      newsFactsDesc: { id: "Peristiwa terkini dijelaskan dengan konteks fakta yang menarik", en: "Current events explained with fascinating factual context" },
      worldCuriosities: { id: "Keajaiban Dunia", en: "World Curiosities" },
      worldCuriositiesDesc: { id: "Keajaiban yang kurang dikenal dan kebenaran mengejutkan tentang planet kita", en: "Little-known wonders and surprising truths about our planet" },
    },
    videosSuffix: { id: "video", en: "videos" },
  },
  videos: {
    badge: { id: "Video Terbaru", en: "Latest Videos" },
    heading1: { id: "Fakta", en: "Fresh" },
    heading2: { id: "Segar", en: "Facts" },
    heading3: { id: "Setiap Hari", en: "Every Day" },
    subtitle: {
      id: "Penemuan terbaru kami — setiap video adalah perjalanan ke sesuatu yang luar biasa.",
      en: "Our latest discoveries — each video is a journey into something extraordinary.",
    },
    viewAll: { id: "Lihat Semua Video di YouTube", en: "View All Videos on YouTube" },
    views: { id: "tayangan", en: "views" },
    today: { id: "Hari ini", en: "Today" },
    daysAgo: { id: "hari lalu", en: "d ago" },
    items: {
      v1Title: {
        id: "Kenapa Kucing Selalu Mendarat dengan Kakinya? Fisikanya Luar Biasa",
        en: "Why Do Cats Always Land on Their Feet? The Physics Is Incredible",
      },
      v2Title: {
        id: "Kota Atlantis yang Hilang — Apa yang Sebenarnya Kita Ketahui?",
        en: "The Lost City of Atlantis — What Do We Actually Know?",
      },
      v3Title: {
        id: "Bagaimana Lubang Hitam Mendistorsi Waktu — Einstein Benar",
        en: "How Black Holes Actually Distort Time — Einstein Was Right",
      },
      v4Title: {
        id: "Jaringan Jalan Romawi Kuno Lebih Canggih dari yang Kita Kira",
        en: "The Ancient Roman Road Network Was More Advanced Than We Thought",
      },
      v5Title: {
        id: "Tumbuhan Paling Berbahaya di Dunia — Dan Ada di Mana-mana",
        en: "The Most Dangerous Plant in the World — And It's Everywhere",
      },
      v6Title: {
        id: "Bagaimana Bulan Perlahan Menjauh dari Bumi",
        en: "How the Moon Is Slowly Drifting Away From Earth",
      },
    },
  },
  why: {
    badge: { id: "Kenapa Factopedia", en: "Why Factopedia" },
    heading1: { id: "Enam Alasan untuk", en: "Six Reasons to" },
    heading2: { id: "Berlangganan", en: "Subscribe" },
    heading3: { id: "Hari Ini", en: "Today" },
    subtitle: {
      id: "Ribuan jiwa penasaran sudah memilih Factopedia sebagai dosis keajaiban harian mereka. Inilah alasannya.",
      en: "Thousands of curious minds already chose Factopedia as their daily dose of wonder. Here's why.",
    },
    items: {
      dailyTitle: { id: "Konten Baru Harian", en: "Daily New Content" },
      dailyDesc: { id: "Fakta baru yang menakjubkan setiap hari pukul 09:00 — tanpa jeda, tanpa pengecualian.", en: "A brand new fascinating fact drops every single day at 9:00 AM — no gaps, no exceptions." },
      dailyHighlight: { id: "365 hari/tahun", en: "365 days/year" },
      reliableTitle: { id: "Informasi Terpercaya", en: "Reliable Information" },
      reliableDesc: { id: "Setiap fakta diteliti dengan cermat dan diverifikasi silang dengan sumber ilmiah dan sejarah yang kredibel.", en: "Every fact is carefully researched and cross-referenced with credible scientific and historical sources." },
      reliableHighlight: { id: "Terverifikasi", en: "Fact-checked" },
      visualsTitle: { id: "Visual Memukau", en: "Stunning Visuals" },
      visualsDesc: { id: "Produksi berkualitas sinematik dengan animasi khusus, infografis, dan penceritaan yang indah.", en: "Cinematic-quality production with custom animations, infographics, and beautiful storytelling." },
      visualsHighlight: { id: "Kualitas HD", en: "HD Quality" },
      shortTitle: { id: "Singkat & Menarik", en: "Short & Engaging" },
      shortDesc: { id: "Setiap video dioptimalkan untuk kepadatan informasi maksimum — sempurna untuk pembelajar sibuk.", en: "Each video is optimized for maximum information density — perfect for busy learners." },
      shortHighlight: { id: "5–15 menit", en: "5–15 minutes" },
      globalTitle: { id: "Perspektif Global", en: "Global Perspective" },
      globalDesc: { id: "Cerita dari setiap benua, setiap era, dan setiap sudut dunia alam.", en: "Stories from every continent, every era, and every corner of the natural world." },
      globalHighlight: { id: "Menjangkau dunia", en: "World-spanning" },
      funTitle: { id: "Penceritaan Seru", en: "Fun Storytelling" },
      funDesc: { id: "Topik kompleks dijelaskan secara sederhana, dengan humor, keajaiban, dan narasi yang membuat Anda terpaku.", en: "Complex topics explained simply, with humor, wonder, and narrative that keeps you hooked." },
      funHighlight: { id: "Selalu menarik", en: "Always engaging" },
    },
  },
  countdown: {
    heading: { id: "Fakta Berikutnya Dalam", en: "Next Fact Drops In" },
    subtitle1: { id: "Video baru setiap hari pukul", en: "New video every day at" },
    subtitle2: { id: "— atur pengingat Anda", en: "— set your reminder" },
    hours: { id: "Jam", en: "Hours" },
    minutes: { id: "Menit", en: "Minutes" },
    seconds: { id: "Detik", en: "Seconds" },
    setReminder: { id: "Atur Pengingat — Berlangganan Gratis", en: "Set Reminder — Subscribe Free" },
  },
  cta: {
    heading1: { id: "Bergabunglah Bersama Ribuan", en: "Join Thousands of" },
    heading2: { id: "Jiwa Penasaran", en: "Curious Minds" },
    subtitle: {
      id: "Berlangganan Factopedia dan jangan pernah lewatkan fakta menakjubkan lagi. Gratis, harian, dan akan mengubah cara Anda melihat dunia.",
      en: "Subscribe to Factopedia and never miss a fascinating fact again. It's free, it's daily, and it will change how you see the world.",
    },
    subscribeFree: { id: "Berlangganan Gratis di YouTube", en: "Subscribe Free on YouTube" },
    browseAll: { id: "Jelajahi Semua Video", en: "Browse All Videos" },
    totalViews: { id: "Total Tayangan", en: "Total Views" },
  },
  footer: {
    tagline: {
      id: "Temukan fakta-fakta paling menakjubkan di dunia. Video baru setiap hari pukul 09:00. Sains, sejarah, hewan, budaya, dan banyak lagi.",
      en: "Discover the world's most fascinating facts. New video every day at 9:00 AM. Science, history, animals, culture, and so much more.",
    },
    categoriesTitle: { id: "Kategori", en: "Categories" },
    contactTitle: { id: "Kontak", en: "Contact" },
    email: { id: "Email", en: "Email" },
    youtubeChannel: { id: "Channel YouTube", en: "YouTube Channel" },
    dailyUpload: { id: "Upload Harian", en: "Daily Upload" },
    dailyUploadTime: { id: "Setiap hari pukul 09:00", en: "Every day at 9:00 AM" },
    copyright: { id: "Hak Cipta Dilindungi.", en: "All rights reserved." },
    privacy: { id: "Kebijakan Privasi", en: "Privacy Policy" },
    terms: { id: "Syarat & Ketentuan", en: "Terms of Service" },
  },
} as const;

type Translations = typeof translations;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("factopedia-locale");
      if (saved === "en" || saved === "id") return saved;
    }
    return "id";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("factopedia-locale", l);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
