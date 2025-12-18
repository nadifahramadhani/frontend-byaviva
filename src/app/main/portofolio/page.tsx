"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
// 1. Import Motion
import { motion } from "framer-motion";

// --- Data Gambar ---
const carouselImages = [
  "/bento/bento1.png",
  "/bento/bento2.png",
  "/bento/bento3.png",
  "/bento/bento4.png",
  "/bento/bento5.png",
];

const galleryImages = [
  "/bento/bento1.png",
  "/bento/bento2.png",
  "/bento/bento3.png",
  "/bento/bento4.png",
  "/bento/bento5.png",
  "/bento/bento6.png",
  "/bento/bento7.png",
  "/bento/bento8.png",
  "/bento/bento9.png",
  "/bento/bento10.png",
];

// --- Variasi Animasi ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export default function PortfolioPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 350;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <main className="w-full min-h-screen pt-[20px] pb-20 overflow-x-hidden [background:radial-gradient(50%_50%_at_64%_65%,rgba(255,228,215,1)_0%,rgba(255,248,238,1)_42%,rgba(222,240,245,1)_76%,rgba(255,248,230,1)_100%)]">
      {/* --- 1. HEADLINE SECTION (ANIMATED) --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Animasi jalan sekali saat 30% terlihat
        variants={staggerContainer}
        className="flex flex-col items-center text-center gap-4 px-4 py-5 md:py-10 max-w-4xl mx-auto"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-3xl md:text-5xl font-bold text-slate-900 font-montserrat"
        >
          Portofolio By Aviva
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-base md:text-xl text-slate-600 max-w-2xl font-lato"
        >
          Jelajahi dokumentasi terbaik kami yang mengabadikan kisah dan emosi di
          setiap detiknya.
        </motion.p>
      </motion.section>

      {/* --- 2. CAROUSEL HIGHLIGHT (ANIMATED) --- */}
      <motion.section
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col items-center gap-8 mb-16"
      >
        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto no-scrollbar pb-8 px-4 md:px-10 scroll-smooth snap-x snap-mandatory"
        >
          <div className="flex gap-6 w-max mx-auto px-4">
            {carouselImages.map((src, index) => (
              <motion.div
                key={index}
                // Animasi masuk untuk setiap item carousel
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative w-[280px] h-[380px] md:w-[320px] md:h-[450px] rounded-[30px] overflow-hidden shadow-xl flex-shrink-0 snap-center transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              >
                <Image
                  src={src}
                  alt={`Highlight ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation & Caption */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 px-4"
        >
          <div className="flex gap-6">
            <button
              onClick={() => scroll("left")}
              className="p-4 bg-white/80 backdrop-blur-sm text-cyan-800 rounded-full hover:bg-cyan-800 hover:text-white transition-all shadow-lg border border-cyan-100 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-4 bg-white/80 backdrop-blur-sm text-cyan-800 rounded-full hover:bg-cyan-800 hover:text-white transition-all shadow-lg border border-cyan-100 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center max-w-2xl mt-2">
            <h3 className="text-xl font-bold font-montserrat text-slate-900 mb-2">
              “Serenity by the Shore”
            </h3>
            <p className="text-sm text-slate-600 font-lato mb-2 leading-relaxed">
              Momen penuh ketenangan di tepi laut, saat angin senja menyapa
              lembut dan gaun putih berkibar di antara cahaya keemasan.
            </p>
            <p className="text-xs font-bold text-slate-500 font-montserrat">
              tag:{" "}
              <span className="font-normal text-slate-700">
                #Prewedding #Beach #SeasideMoment
              </span>
            </p>
          </div>

          <Link
            href="/booking"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-cyan-800 text-white rounded-lg overflow-hidden transition-all hover:bg-cyan-900 hover:shadow-lg hover:-translate-y-1"
          >
            <span className="font-bold text-base tracking-wide font-nunito-sans">
              Booking Now
            </span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.section>

      {/* --- 3. MAIN GALLERY SECTION (ANIMATED) --- */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/60 backdrop-blur-md rounded-[40px] p-6 md:p-10 shadow-lg border border-white/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-slate-200/60 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-montserrat">
              ByViva’s Portofolios
            </h2>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1 md:w-80 shadow-sm focus-within:border-cyan-600 transition-all">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
                />
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan-800 text-white rounded-xl hover:bg-cyan-900 transition shadow-md active:scale-95">
                <span className="text-sm font-bold">Filter</span>
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GRID GALLERY */}
          {/* Menggunakan variants container untuk efek muncul berturutan */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[300px]">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="relative w-full md:w-1/3 h-[250px] md:h-full rounded-[30px] overflow-hidden group shadow-md"
                >
                  <Image
                    src={galleryImages[i]}
                    alt={`Gallery ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[500px]">
              {[4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="relative w-full md:w-1/3 h-[400px] md:h-full rounded-[30px] overflow-hidden group shadow-md"
                >
                  <Image
                    src={galleryImages[i]}
                    alt={`Gallery ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[300px]">
              {/* Custom logic for unequal widths */}
              <motion.div
                variants={scaleIn}
                className="relative w-full md:w-1/3 h-[250px] md:h-full rounded-[30px] overflow-hidden group shadow-md"
              >
                <Image
                  src={galleryImages[7]}
                  alt="Gallery 8"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
              <motion.div
                variants={scaleIn}
                className="relative w-full md:w-2/3 h-[250px] md:h-full rounded-[30px] overflow-hidden group shadow-md"
              >
                <Image
                  src={galleryImages[8]}
                  alt="Gallery 9"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
