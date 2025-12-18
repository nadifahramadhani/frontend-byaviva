"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, ChevronRight } from "lucide-react";

// --- Asset Paths ---
// Pastikan path ini benar sesuai folder public Anda
const aboutImage1 = "/bento/bento11.jpg";
const aboutImage2 = "/bento/bento12.jpg";
const footerImage = "/bento/phone.png"; // Gambar Mockup HP
// const footerDecor = "/bento/phone.png"; // Hapus jika duplikat atau ganti dengan gambar dekorasi lain jika ada

// ... (Variants Animasi tetap sama) ...
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
    transition: { staggerChildren: 0.2 },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

// ... (Reusable Components tetap sama) ...
const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <motion.div
    className="flex flex-col items-center text-center gap-4 mb-12 px-4"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeInUp}
  >
    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-montserrat">
      {title}
    </h1>
    {subtitle && (
      <p className="text-lg md:text-xl text-slate-600 max-w-3xl font-lato">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const StatCard = ({ val, label }: { val: string; label: string }) => (
  <motion.div
    variants={scaleUp}
    className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md w-full hover:shadow-lg transition-shadow"
  >
    <div className="text-3xl md:text-4xl font-bold text-cyan-950 mb-1 font-montserrat">
      {val}
    </div>
    <div className="text-sm md:text-base font-semibold text-cyan-600 font-montserrat">
      {label}
    </div>
  </motion.div>
);

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen pt-[20px] overflow-x-hidden [background:radial-gradient(50%_50%_at_64%_65%,rgba(255,228,215,1)_0%,rgba(255,248,238,1)_42%,rgba(222,240,245,1)_76%,rgba(255,248,230,1)_100%)]">
      {/* 1. HEADLINE */}
      <section className="py-5 md:py-10 px-4 max-w-7xl mx-auto">
        <SectionHeading
          title="Tentang By Aviva"
          subtitle="Jelajahi dokumentasi terbaik kami yang mengabadikan kisah dan emosi di setiap detiknya."
        />
      </section>

      {/* 2. STORY SECTION */}
      <section className="px-4 max-w-7xl mx-auto mb-24">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Left: Image Grid */}
          <motion.div
            className="relative w-full max-w-md lg:max-w-lg h-[400px] md:h-[500px]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 left-0 w-[70%] h-[60%] rounded-2xl overflow-hidden shadow-lg z-10 bg-gray-200">
              <Image
                src={aboutImage1}
                alt="Team Working"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[75%] h-[65%] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 bg-gray-300">
              <Image
                src={aboutImage2}
                alt="Studio Session"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-montserrat mb-2">
              Di Balik Setiap Karya
            </h2>
            <h3 className="text-lg md:text-xl font-medium text-slate-700 font-montserrat mb-6">
              Menyapa, mendengar, dan menciptakan kenangan Anda.
            </h3>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-lato">
              By Aviva adalah tim dokumentasi kreatif yang berfokus pada
              menghadirkan hasil visual berkualitas tinggi dengan sentuhan
              personal.
              <br />
              <br />
              Kami percaya bahwa setiap momen punya makna unik — dari senyum
              kecil hingga detail yang nyaris terlupakan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionHeading
            title="Ribuan Momen, Satu Cerita"
            subtitle="Setiap angka menyimpan kisah dan dedikasi dalam setiap karya."
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <StatCard val="120" label="Klien Bahagia" />
            <StatCard val="54802" label="Karya Terselesaikan" />
            <StatCard val="500" label="Sesi Pemotretan" />
            <StatCard val="5" label="Tahun Pengalaman" />
          </motion.div>
        </div>
      </section>

      {/* 4. FOOTER CTA SECTION (PERBAIKAN DI SINI) */}
      <section className="py-20 px-4 max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Decorative Images (MOCKUP HP) */}
          <motion.div
            className="relative w-full max-w-[400px] h-[400px] hidden md:block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* PERUBAHAN UTAMA:
                1. Hapus bg-gray-200/300 agar background transparan (karena mockup biasanya PNG transparan).
                2. Ganti object-cover menjadi object-contain agar seluruh gambar HP terlihat utuh.
                3. Hapus overflow-hidden jika shadow mockup terpotong.
             */}

            {/* Gambar Belakang (Kiri) */}
            <div className="absolute top-0 left-8 w-[240px] h-[360px] -rotate-6 z-10">
              <div className="relative w-full h-full">
                <Image
                  src={footerImage}
                  alt="Mockup HP 1"
                  fill
                  className="object-contain drop-shadow-xl" // Gunakan object-contain & drop-shadow
                />
              </div>
            </div>

            {/* Gambar Depan (Kanan) */}
            <div className="absolute top-8 right-8 w-[240px] h-[360px] rotate-6 z-20">
              <div className="relative w-full h-full">
                <Image
                  src={footerImage}
                  alt="Mockup HP 2"
                  fill
                  className="object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: CTA Content */}
          <motion.div
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-montserrat mb-4">
              Terhubung Lebih Dekat dengan By Aviva
            </h2>
            <p className="text-base text-slate-600 mb-8 max-w-lg font-lato">
              Temukan karya terbaru dan kisah visual kami di media sosial.
              <br />
              Terhubung langsung untuk kolaborasi dan pemesanan eksklusif.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#"
                className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg border-2 border-slate-600 text-slate-800 font-bold hover:bg-slate-600 hover:text-white transition-all group"
              >
                Explore Instagram
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg border-2 border-slate-600 text-slate-800 font-bold hover:bg-slate-600 hover:text-white transition-all group"
              >
                Chat Via WhatsApp
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
