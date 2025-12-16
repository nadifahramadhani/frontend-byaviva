import React from "react";
import Image from "next/image";
import { IconArrowRight } from "@/components/Icons"; // Pastikan path icon benar
import Link from "next/link";

// Data untuk setiap langkah
const steps = [
  {
    id: "01",
    title: "Diskusi Bersama Admin",
    description:
      "Mulailah dengan menghubungi admin kami untuk berdiskusi tentang kebutuhan dan ide sesi fotomu.",
    image: "/step/step1.png", // Pastikan gambar ada di public/images
    bgColor: "bg-cyan-700", // Teal
    textColor: "text-white",
    align: "left", // Posisi kartu di kiri
    rotation: "rotate-6",
  },
  {
    id: "02",
    title: "Lengkapi Formulir Pemesanan",
    description:
      "Isi data dan jadwal pemotretan sesuai waktu yang kamu inginkan untuk memastikan ketersediaan.",
    image: "/step/step2.png",
    bgColor: "bg-sky-200", // Powderblue
    textColor: "text-slate-800",
    align: "right", // Posisi kartu di kanan
    rotation: "-rotate-6",
  },
  {
    id: "03",
    title: "Tentukan Konsep Foto",
    description:
      "Bagikan ide, tema, atau referensi gaya yang kamu inginkan untuk sesi pemotretanmu.",
    image: "/step/step3.png",
    bgColor: "bg-cyan-700",
    textColor: "text-white",
    align: "left",
    rotation: "-rotate-3",
  },
  {
    id: "04",
    title: "Selesaikan Proses Pembayaran",
    description:
      "Konfirmasi pemesanan dengan melakukan pembayaran sesuai paket yang dipilih.",
    image: "/step/step4.png",
    bgColor: "bg-sky-200",
    textColor: "text-slate-800",
    align: "right",
    rotation: "rotate-3",
  },
];

export const BookingSteps = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-20 px-4">
      {/* Container Langkah-Langkah */}
      <div className="relative flex flex-col gap-16 md:gap-0">
        {/* Garis Tengah (Hanya muncul di Desktop) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block rounded-full"></div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col md:flex-row items-center w-full ${
              step.align === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Bagian KARTU (Kiri atau Kanan) */}
            <div className="w-full md:w-1/2 flex justify-center p-4">
              <div
                className={`relative bg-white p-4 rounded-xl shadow-lg w-full max-w-sm transform transition-transform hover:scale-105 duration-300 ${step.rotation}`}
              >
                {/* Gambar Langkah */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  {/* Gunakan placeholder jika gambar belum ada */}
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Teks */}
                <h3 className="text-xl font-bold text-cyan-950 mb-2 font-montserrat">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 font-lato leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Bagian NOMOR (Tengah) */}
            <div className="relative z-10 flex-shrink-0 my-4 md:my-0">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] border-slate-700 flex items-center justify-center shadow-lg ${step.bgColor}`}
              >
                <span
                  className={`text-2xl md:text-3xl font-bold font-montserrat ${step.textColor}`}
                >
                  {step.id}
                </span>
              </div>
            </div>

            {/* Spacer Kosong (Untuk menyeimbangkan grid di desktop) */}
            <div className="w-full md:w-1/2 hidden md:block"></div>
          </div>
        ))}
      </div>

      {/* Tombol CTA (Discussion your idea) */}
      <div className="flex justify-center mt-20">
        <Link
          href="/booking"
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-800 text-white rounded-lg overflow-hidden transition-all hover:bg-cyan-900 hover:shadow-xl hover:-translate-y-1"
        >
          <span className="font-bold text-lg tracking-wide font-nunito-sans">
            Discussion your idea
          </span>
          <IconArrowRight
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            color="white"
          />
        </Link>
      </div>
    </section>
  );
};
