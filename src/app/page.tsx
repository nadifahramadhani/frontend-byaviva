"use client"; // Wajib untuk Framer Motion

import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { motion } from "framer-motion";
import { IconArrowRight } from "@/components/Icons";
import { Bento } from "@/components/Bento";
import { BookingSteps } from "@/components/BookingSteps";

// ... (Asset paths & Animation Variants TETAP SAMA, tidak perlu diubah) ...
const bento = "/images/bento.svg";

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
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ... (Komponen Kecil TETAP SAMA) ...
const SectionHeading = ({
  title,
  subtitle,
  description,
}: {
  title?: string;
  subtitle?: string;
  description?: string;
}) => (
  <motion.div
    className="flex flex-col items-center text-center gap-4 px-4 max-w-4xl mx-auto mb-10"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
  >
    {title && (
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-montserrat">
        {title}
      </h1>
    )}
    {subtitle && (
      <h2 className="text-xl md:text-3xl font-semibold text-slate-800 font-montserrat">
        {subtitle}
      </h2>
    )}
    {description && (
      <p className="text-base md:text-lg text-slate-600 max-w-2xl font-lato">
        {description}
      </p>
    )}
  </motion.div>
);

const PolaroidCard = ({
  rotation,
  imageSrc,
  altText,
  className,
}: {
  rotation: string;
  imageSrc: string;
  altText: string;
  className?: string;
}) => (
  <motion.div
    variants={fadeInUp}
    className={`relative bg-white p-3 pb-8 shadow-lg rounded-sm transform w-64 md:w-72 flex-shrink-0 ${rotation} ${className}`}
    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full shadow-inner z-10 border border-white"></div>
    <div className="w-full aspect-[4/5] relative overflow-hidden bg-gray-200">
      <Image
        src={imageSrc}
        alt={altText}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
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

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
  <motion.div
    variants={fadeInUp}
    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center h-full"
  >
    <h3 className="text-xl font-bold text-cyan-950 mb-3 font-montserrat">
      {title}
    </h3>
    <p className="text-sm text-neutral-400 leading-relaxed font-lato">{desc}</p>
  </motion.div>
);

const CtaLink = ({ text, href }: { text: string; href: string }) => (
  <Link href={href} passHref>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-800 text-white rounded-lg overflow-hidden transition-all hover:bg-cyan-900 hover:shadow-lg cursor-pointer"
    >
      <span className="font-bold text-lg tracking-wide font-nunito-sans">
        {text}
      </span>
      <IconArrowRight
        className="w-5 h-5 transition-transform group-hover:translate-x-1"
        color="white"
      />
    </motion.div>
  </Link>
);

// --- Halaman Utama ---

export default function HomePage() {
  return (
    <main className="w-full min-h-screen pt-[20px] [background:radial-gradient(50%_50%_at_64%_65%,rgba(255,228,215,1)_0%,rgba(255,248,238,1)_42%,rgba(222,240,245,1)_76%,rgba(255,248,230,1)_100%)]">
      {/* 1. HERO SECTION */}
      <section className="py-5 md:py-10 px-4">
        <SectionHeading
          title="By Aviva Visual Studio"
          subtitle="Solusi dokumentasi kreatif dan dinamis untuk setiap kebutuhan Anda"
          description="Dari branding, event, hingga foto produk — By Aviva menghadirkan hasil berkualitas tinggi dengan gaya modern yang memikat perhatian."
        />

        {/* Polaroid Gallery */}
        <div className="relative w-full max-w-7xl mx-auto mt-8 md:mt-16">
          {/* Scroll Horizontal untuk Polaroid tetap dipertahankan dengan 'overflow-x-auto' */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 py-10 overflow-x-auto md:overflow-visible no-scrollbar px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <PolaroidCard
              rotation="md:rotate-6 md:translate-y-0"
              imageSrc="/bento/bento7.png"
              altText="Foto Cincin Pernikahan"
            />
            <PolaroidCard
              rotation="md:rotate-2 md:translate-y-12"
              imageSrc="/bento/bento8.png"
              altText="Foto Anak-anak di Pantai"
            />
            <PolaroidCard
              rotation="md:-rotate-2 md:translate-y-12"
              imageSrc="/bento/bento9.png"
              altText="Foto Mempelai Wanita"
            />
            <PolaroidCard
              rotation="md:-rotate-6 md:translate-y-0"
              imageSrc="/bento/bento10.png"
              altText="Pasangan Tukar cincin"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <StatCard val="120" label="Klien Bahagia" />
          <StatCard val="54802" label="Karya Terselesaikan" />
          <StatCard val="500" label="Sesi Pemotretan" />
          <StatCard val="5" label="Tahun Pengalaman" />
        </motion.div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Tombol Booking Now mengarah ke /booking */}
          <CtaLink text="Booking Now" href="/booking" />
        </motion.div>
      </section>

      {/* 3. PORTFOLIO PREVIEW */}
      <section className="py-16 px-4">
        <SectionHeading
          title="Hasil Karya Kami"
          subtitle="Jelajahi koleksi dokumentasi terbaik dari berbagai acara dan proyek klien kami."
        />

        {/* Bento Grid Container */}
        <motion.div
          className="w-full max-w-7xl mx-auto mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Bento />
        </motion.div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Tombol Learn More mengarah ke /portofolio */}
          <CtaLink text="Learn More" href="/portofolio" />
        </motion.div>
      </section>

      {/* 4. VALUE PROPOSITION */}
      <section className="py-20 px-4 max-w-7xl mx-auto mb-20">
        <SectionHeading
          title="Sentuhan Profesional, Hasil yang Bermakna"
          subtitle="Layanan profesional untuk kenangan yang berkesan dan bermakna selamanya."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 px-4 md:px-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <FeatureCard
            title="Profesional & Berpengalaman"
            desc="Setiap anggota tim kami memiliki pengalaman dalam dunia fotografi dan dokumentasi acara. Kami memastikan hasil berkualitas tinggi."
          />
          <FeatureCard
            title="Konsep Unik & Personal"
            desc="Kami percaya setiap klien punya cerita berbeda. Setiap sesi dibuat dengan pendekatan personal menyesuaikan karakter unikmu."
          />
          <FeatureCard
            title="Kualitas Visual Premium"
            desc="Dari pencahayaan hingga tone warna, setiap detail dikerjakan dengan cermat menggunakan peralatan teknik terbaik."
          />
          <FeatureCard
            title="Layanan Cepat & Ramah"
            desc="Mulai dari konsultasi awal hingga hasil akhir, tim kami selalu siap membantu dengan komunikasi yang hangat dan cepat."
          />
        </motion.div>
      </section>

      {/* 5. BOOKING FLOW STEPS */}
      <section className="py-10">
        <motion.div
          className="text-center mb-10 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-montserrat mb-4">
            Pesan Momen Spesialmu dengan Mudah
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-lato">
            Ikuti langkah mudah berikut untuk memesan sesi dokumentasi terbaik
            bersama tim By Aviva.
          </p>
        </motion.div>

        {/* Komponen BookingSteps */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <BookingSteps />
        </motion.div>
      </section>
    </main>
  );
}
