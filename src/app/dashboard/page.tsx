"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import penting
import { PageHeaderCard } from "@/components/dashboard/PageHeaderCard";
import { BookingCard } from "@/components/dashboard/BookingCard";
import axiosInstance from "@/lib/axios";
import { Loader2, Inbox } from "lucide-react";

// ... (Interface BookingResponse dll biarkan sama) ...
interface BookingResponse {
  id: number;
  bookingNumber: string;
  status: string;
  createdAt: string;
  layanan: { nama: string; harga: number };
  schedule: {
    tanggalBooking: string;
    startTime: string;
    endTime: string;
  } | null;
  pricing: { totalAmount: number };
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil token dari URL (jika ada)
  const tokenFromUrl = searchParams.get("token");

  // --- 1. PROSES TOKEN (Jalan Pertama) ---
  useEffect(() => {
    if (tokenFromUrl) {
      // Jika ada token di URL, simpan ke LocalStorage
      console.log("Menyimpan token dari Google Login...");
      localStorage.setItem("accessToken", tokenFromUrl);

      // Bersihkan URL agar rapi (hapus ?token=...)
      // router.replace akan memicu render ulang tanpa query param
      router.replace("/dashboard");
    }
  }, [tokenFromUrl, router]);

  // --- 2. FETCH DATA (Jalan Kedua) ---
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/booking/my-bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Gagal mengambil data booking:", error);
      } finally {
        setLoading(false);
      }
    };

    // PENTING: Cegah fetch jika token masih ada di URL (artinya proses simpan belum kelar)
    // Kita hanya fetch kalau URL sudah bersih (artinya token sudah masuk localStorage)
    // ATAU kalau memang tidak ada token di URL sejak awal (login biasa)
    if (!tokenFromUrl) {
      fetchMyBookings();
    }
  }, [tokenFromUrl]); // Dependency ke tokenFromUrl

  // Helpers formatting (biarkan sama)
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Belum dijadwalkan";
  const mapStatus = (status: string) => {
    // ... logic mapStatus kamu ...
    if (status === "waiting_payment") return "Waiting";
    return "Upcoming"; // Contoh simplified
  };

  // --- RENDER ---
  // Jika sedang memproses token URL, tampilkan loading layar penuh biar user tidak bingung
  if (tokenFromUrl) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-800 mb-4" />
        <p className="text-slate-600 font-medium">Memproses Login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* HEADER STICKY */}
      <div className="sticky top-[94px] z-10 w-full bg-foundation-primarylight pb-5 pt-2 transition-all">
        <PageHeaderCard
          title="My Bookings"
          subtitle="Daftar pemesanan foto Anda."
        />
      </div>

      <div className="flex flex-col items-start gap-[30px] p-[20px] md:p-[40px] w-full bg-white rounded-[20px] shadow-sm min-h-[80vh]">
        {loading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-2 text-orange-500" />
            <p>Memuat data booking...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            <Inbox className="w-12 h-12 mb-3 text-gray-300" />
            <p>Belum ada booking.</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.bookingNumber}
                numericId={booking.id}
                packageName={booking.layanan.nama}
                date={formatDate(booking.schedule?.tanggalBooking)}
                price={formatRupiah(booking.pricing.totalAmount)}
                status={
                  booking.status === "waiting_payment" ? "Waiting" : "Upcoming"
                } // Sesuaikan mapStatus
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
