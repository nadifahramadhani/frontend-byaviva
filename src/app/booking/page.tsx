"use client";

import { useState } from "react";
// Import useBooking agar bisa baca data harga di halaman ini
import { BookingProvider, useBooking } from "@/context/BookingContext";
import Step1PraBooking from "@/components/booking/Step1PraBooking";
import Step2BookingData from "@/components/booking/Step2BookingData";
import Step3SelectPackage from "@/components/booking/Step3SelectPackage";
import Step4Confirmation from "@/components/booking/Step4Confirmation";
import PaymentUpload from "@/components/booking/PaymentUpload";
import ProgressBar from "@/components/booking/ProgressBar";
import PaymentSuccess from "@/components/booking/PaymentSuccess";

// Wrapper Component untuk menyediakan Context ke BookingWizard
export default function BookingPage() {
  return (
    <BookingProvider>
      <BookingWizard />
    </BookingProvider>
  );
}

function BookingWizard() {
  const [step, setStep] = useState(1);
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  // --- AKSES DATA UNTUK FOOTER (Total Harga & Validasi) ---
  const { data } = useBooking();

  // --- DATA TITLE & SUBTITLE ---
  const headerData = {
    1: {
      title: "Mulai Perjalanan Visual Bersama By Aviva",
      subtitle: "Diskusikan ide dan jadwal pemotretan.",
    },
    2: {
      title: "Lengkapi Data Pemesanan",
      subtitle:
        "Isi data diri dan detail acara untuk melanjutkan proses booking.",
    },
    3: {
      title: "Pilih Paket Dokumentasi",
      subtitle:
        "Pilih paket layanan yang sesuai dengan kebutuhan momen spesial Anda.",
    },
    4: {
      title: "Konfirmasi Pesanan",
      subtitle:
        "Periksa kembali rincian pesanan Anda sebelum melakukan pembayaran.",
    },
    5: {
      title: "Selesaikan Pembayaran",
      subtitle:
        "Lakukan pembayaran dan upload bukti transfer untuk konfirmasi.",
    },
  };

  const currentHeader =
    headerData[step as keyof typeof headerData] || headerData[1];

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleBookingSuccess = (bookingId: number) => {
    setCreatedBookingId(bookingId);
    nextStep();
  };

  // Helper Format Rupiah (untuk Footer)
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Validasi khusus untuk tombol di Footer Step 3
  const isStep3Valid = data.packageId && data.conceptId;
  const totalHarga = (data.packagePrice || 0) + (data.conceptPrice || 0);

  return (
    <main className="w-full min-h-screen pt-[20px] pb-20 overflow-x-hidden [background:radial-gradient(50%_50%_at_64%_65%,rgba(255,228,215,1)_0%,rgba(255,248,238,1)_42%,rgba(222,240,245,1)_76%,rgba(255,248,230,1)_100%)]">
      {/* --- HEADER --- */}
      <section className="flex flex-col items-center text-center gap-4 px-4 py-5 md:py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-montserrat">
          {currentHeader.title}
        </h1>
        <p className="text-base md:text-xl text-slate-600 max-w-2xl font-lato">
          {currentHeader.subtitle}
        </p>
      </section>

      {/* --- KONTEN UTAMA --- */}
      <div className="min-h-screen bg-orange-50/30 font-sans pb-32">
        {" "}
        {/* Tambah pb-32 agar konten tidak tertutup footer fixed */}
        <ProgressBar currentStep={step} />
        <main className="container mx-auto px-4 max-w-5xl">
          {step === 1 && <Step1PraBooking onNext={nextStep} />}
          {step === 2 && <Step2BookingData onNext={nextStep} />}

          {/* STEP 3: SELECT PACKAGE */}
          {/* Note: Footer & Tombol Next Step 3 dipindahkan ke luar (fixed position) */}
          {step === 3 && (
            <Step3SelectPackage onNext={nextStep} onBack={prevStep} />
          )}

          {step === 4 && (
            <Step4Confirmation
              onBookingSuccess={handleBookingSuccess}
              onBack={prevStep}
            />
          )}

          {step === 5 &&
            (isUploadSuccess ? (
              <PaymentSuccess bookingId={createdBookingId} />
            ) : (
              <div className="max-w-xl mx-auto text-center animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Booking Berhasil Dibuat!
                    </h2>
                    <p className="text-gray-500 mt-2">
                      ID Booking:{" "}
                      <span className="font-mono font-bold text-orange-600">
                        #{createdBookingId}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Silakan upload bukti transfer DP.
                    </p>
                  </div>
                  {createdBookingId && (
                    <PaymentUpload
                      transactionId={createdBookingId}
                      onSuccess={() => setIsUploadSuccess(true)}
                    />
                  )}
                </div>
              </div>
            ))}
        </main>
      </div>

      {/* --- FOOTER MELAYANG (KHUSUS STEP 3) --- */}
      {/* Logic: Hanya render div ini jika step === 3.
          Posisi: Fixed di bawah layar (z-50 agar paling atas).
      */}
      {step === 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <div className="max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 w-full md:w-auto text-center md:text-left">
              <p className="text-gray-500 text-sm">Estimasi Total Biaya</p>
              <p className="text-3xl font-bold text-slate-800">
                {formatRupiah(totalHarga)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {data.conceptName
                  ? `Konsep: ${data.conceptName}`
                  : "Pilih Konsep"}
                {" / "}
                {data.packageName
                  ? `Paket: ${data.packageName}`
                  : "Pilih Paket"}
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-full font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all flex-1 md:flex-none"
              >
                &larr; Kembali
              </button>
              <button
                onClick={nextStep}
                disabled={!isStep3Valid}
                className={`
                      px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg flex-1 md:flex-none flex items-center justify-center gap-2
                      ${
                        isStep3Valid
                          ? "bg-slate-800 hover:bg-slate-700 hover:scale-105"
                          : "bg-gray-300 cursor-not-allowed shadow-none"
                      }
                    `}
              >
                Lanjut Pembayaran &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
