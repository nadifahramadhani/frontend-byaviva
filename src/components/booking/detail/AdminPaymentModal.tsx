// components/booking/detail/AdminPaymentModal.tsx
import React, { useState } from "react";
import { X, Loader2, UploadCloud, Info } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface AdminPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingId: number;
  remainingBill: number; // Sisa tagihan (Info Only)
}

export const AdminPaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  bookingId,
  remainingBill,
}: AdminPaymentModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !confirm(
        "Yakin ingin mencatat pelunasan ini? Booking akan menjadi LUNAS (Paid)."
      )
    )
      return;

    setLoading(true);

    try {
      const formData = new FormData();
      // Backend function: createPelunasanByAdmin(bookingId, buktiBayarUrl)
      // Jadi kita hanya perlu kirim file, ID ada di URL param.

      if (file) {
        formData.append("proof_image", file);
      }

      // Jika butuh field lain untuk bypass validasi upload (misal 'is_manual'), tambahkan disini.
      // Tapi karena buktiBayarUrl di backend type-nya string | null, berarti aman kalau kosong.

      // Tembak Endpoint Pelunasan Admin
      await axiosInstance.post(`/payments/pelunasan/${bookingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Pelunasan berhasil dicatat!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal mencatat pelunasan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-lg text-slate-800">
            Input Pelunasan (Admin)
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">
                Pelunasan Otomatis
              </p>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Sistem akan otomatis mencatat pembayaran sebesar sisa tagihan:
                <br />
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(remainingBill)}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase">
              Bukti Transfer (Opsional)
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Jika pembayaran Cash, biarkan kosong.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition relative group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-blue-50 transition">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-600 block">
                    {file ? file.name : "Klik untuk upload bukti"}
                  </span>
                  {!file && (
                    <span className="text-xs text-gray-400">
                      PNG, JPG, JPEG (Max 2MB)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex justify-center gap-2 items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Simpan Pelunasan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
