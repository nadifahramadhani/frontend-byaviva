"use client";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

// 👇 UBAH DI SINI: Ganti 'onNext' jadi 'onBookingSuccess' agar sinkron dengan BookingWizard
export default function Step4Confirmation({
  onBookingSuccess,
  onBack,
}: {
  onBookingSuccess: (id: number) => void; // Terima ID number
  onBack: () => void;
}) {
  const { data } = useBooking();
  const [loading, setLoading] = useState(false);

  // --- HELPER: FORMAT RUPIAH (TETAP SAMA) ---
  const formatRupiah = (num?: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  // --- HELPER: FORMAT TANGGAL (TETAP SAMA) ---
  const formatDate = (date?: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- HITUNG TOTAL (TETAP SAMA) ---
  const totalPrice = (data.packagePrice || 0) + (data.conceptPrice || 0);

  // --- LOGIC SUBMIT KE DATABASE ---
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Sesi kamu telah habis atau belum login. Silakan login ulang.");
        return;
      }

      // 2. HITUNG END TIME OTOMATIS (TETAP SAMA)
      const [jam, menit] = (data.shootTime || "10:00").split(":").map(Number);
      let jamSelesai = jam + 2;
      if (jamSelesai >= 24) jamSelesai -= 24;
      const endTimeString = `${jamSelesai.toString().padStart(2, "0")}:${menit
        .toString()
        .padStart(2, "0")}`;

      // 3. SUSUN PAYLOAD (TETAP SAMA)
      const payload = {
        layananId: Number(data.packageId),
        konsepId: data.conceptId ? Number(data.conceptId) : undefined,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        lokasi: data.lokasi,
        tanggalBooking: data.shootDate,
        startTime: data.shootTime,
        endTime: endTimeString,
        tanggalDiskusiAwal: data.discussion1Date,
        tanggalDiskusiAkhir: data.discussion2Date
          ? data.discussion2Date
          : undefined,
      };

      console.log("Mengirim Booking...", payload);

      // 4. TEMBAK API
      const response = await axiosInstance.post("/booking", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Booking Berhasil:", response.data);
      // alert("Booking Berhasil Dibuat!"); // Opsional

      // 👇 PERUBAHAN PENTING:
      // Ambil ID dari response backend, lalu kirim ke atas pakai onBookingSuccess
      const newBookingId = response.data.id;

      if (newBookingId) {
        onBookingSuccess(newBookingId); // Oper ID ke Step 5
      } else {
        // Jaga-jaga kalau backend lupa kirim ID
        alert("Booking berhasil tapi ID tidak ditemukan.");
      }
    } catch (error: any) {
      console.error("Gagal Booking:", error);
      const pesanError = error.response?.data?.message
        ? Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message
        : "Terjadi kesalahan saat menyimpan booking.";

      alert(`Gagal Booking: ${pesanError}`);
    } finally {
      setLoading(false);
    }
  };

  // --- RETURN JSX (TIDAK ADA YANG DIUBAH SAMA SEKALI DARI KODEMU) ---
  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800">
          Review Detail Booking
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* --- 1. CLIENT INFORMATION --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b">
            Client Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Nama
              </label>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium">
                {data.clientName || "-"}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Email
              </label>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium">
                {data.clientEmail || "-"}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                No HP
              </label>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium">
                {data.clientPhone || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. LOCATION & DATE --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b">
            Location & Date
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Lokasi Shoot
              </label>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium">
                {data.lokasi || "-"}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Jadwal Shoot
              </label>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium flex justify-between">
                <span>{formatDate(data.shootDate)}</span>
                <span className="font-bold text-orange-600">
                  {data.shootTime}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Jadwal Diskusi 1
              </label>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium flex justify-between">
                <span>{formatDate(data.discussion1Date)}</span>
                <span className="font-bold text-orange-600">
                  {data.discussion1Time}
                </span>
              </div>
            </div>
            {data.discussion2Date && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Jadwal Diskusi 2
                </label>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-slate-800 font-medium flex justify-between">
                  <span>{formatDate(data.discussion2Date)}</span>
                  <span className="font-bold text-orange-600">
                    {data.discussion2Time}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8">
        <h3 className="font-bold text-slate-800 text-xl mb-6 pb-3 border-b border-orange-500">
          Ringkasan Pilihan Layanan
        </h3>

        {/* HEADER KONSEP (PARENT) */}
        <div className="flex gap-5 items-start bg-slate-50 p-4 rounded-xl border border-gray-100 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              // Menggunakan fotoUrl dari Konsep yang dipilih
              src={
                data.conceptFotoUrl ||
                "https://via.placeholder.com/100?text=Konsep"
              }
              className="w-full h-full object-cover"
              alt={data.conceptName || "Konsep"}
              // Tambahkan onError handler jika perlu
            />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase">
              Paket Layanan Pilihan
            </span>
            <h4 className="font-bold text-xl text-slate-800 mt-1">
              {data.conceptName || "Konsep Belum Dipilih"}
            </h4>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {data.conceptDescription}
            </p>
          </div>
        </div>

        {/* DETAIL PAKET (CHILD) */}
        <div className="pl-5 border-l-4 border-orange-500">
          <h4 className="font-semibold text-lg text-slate-800 mb-2">
            Konsep Visual
          </h4>
          <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
            <span className="font-bold text-lg text-slate-800">
              {data.packageName || "Paket Belum Dipilih"}
            </span>
            <span className="font-bold text-xl text-orange-600">
              {formatRupiah(data.packagePrice)}
            </span>
          </div>

          {/* Detail Manfaat (Opsional, dari deskripsi paket) */}
          <p className="text-sm text-gray-500 mt-2 italic">
            {/* Asumsi Anda menyimpan deskripsi paket di context */}
            {data.packageDescription || "Silakan kembali dan pilih konsep."}
          </p>
        </div>

        {/* FOOTER: TOTAL HARGA */}
        <div className="mt-8 pt-4 border-t border-dashed">
          {/* Harga Konsep: Selalu IDR 0 */}
          {/* <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Harga Konsep Visual (IDR)</span>
            <span className="font-bold text-slate-800">
              {formatRupiah(data.conceptPrice)}
            </span>
          </div> */}

          <div className="flex justify-between items-center pt-3 mt-2">
            <span className="text-xl font-bold text-slate-800">
              Total Biaya Layanan
            </span>
            <span className="text-3xl font-bold text-orange-600">
              {formatRupiah(totalPrice)}
            </span>
          </div>

          <div className="text-right mt-1">
            <span className="text-sm text-green-600">
              Termasuk semua layanan & konsep terpilih.
            </span>
          </div>
        </div>
      </div>

      {/* --- FOOTER BUTTONS --- */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-8 py-3 rounded-full font-bold text-gray-500 bg-gray-200 hover:bg-gray-300 transition-all disabled:opacity-50"
        >
          Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-3 rounded-full font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </>
          ) : (
            "Konfirmasi & Booking"
          )}
        </button>
      </div>
    </div>
  );
}
