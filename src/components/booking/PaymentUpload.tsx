"use client";

import React, { useEffect, useState } from "react";
// 1. GANTI INI: Pakai instance kita, jangan axios polos
import axiosInstance from "@/lib/axios";
import { Copy, CheckCircle, UploadCloud, Loader2 } from "lucide-react";

interface PaymentUploadProps {
  transactionId: number;
  onSuccess?: () => void;
}

const PaymentUpload = ({ transactionId, onSuccess }: PaymentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // State bill info
  const [billInfo, setBillInfo] = useState<any>(null);
  const [loadingBill, setLoadingBill] = useState(true);
  const [copied, setCopied] = useState(false);

  // --- 1. FETCH BILL INFO (Pakai axiosInstance) ---
  useEffect(() => {
    const fetchBill = async () => {
      try {
        // Gak perlu header manual, axiosInstance urus tokennya
        const res = await axiosInstance.get(
          `/payments/bill-info/${transactionId}`
        );
        setBillInfo(res.data);
      } catch (err) {
        console.error("Gagal ambil bill info", err);
      } finally {
        setLoadingBill(false);
      }
    };

    if (transactionId) fetchBill();
  }, [transactionId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // --- 2. UPLOAD ACTION (Pakai axiosInstance) ---
  const handleUpload = async () => {
    if (!file) return alert("Pilih file dulu!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // URL cukup path-nya saja, BaseURL sudah diatur di axiosInstance
      await axiosInstance.post(`/payments/dp/${transactionId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization gak perlu ditulis lagi
        },
      });

      alert("Bukti pembayaran berhasil diupload!");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Upload Error:", error);
      const serverMessage = error.response?.data?.message || "Gagal upload";
      alert(`Error: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const handleCopyRekening = () => {
    navigator.clipboard.writeText("234578906511");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadingBill)
    return (
      <div className="text-center py-10 flex flex-col items-center gap-2 text-gray-400">
        <Loader2 className="animate-spin" /> Memuat Tagihan...
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-6 font-montserrat">
      {/* CARD 1: BILL INFO */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-5 bg-gray-50 border-b border-gray-100">
          <h4 className="font-bold text-slate-800 text-center">
            Rincian Pembayaran
          </h4>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {/* Info Nominal */}
            <div className="space-y-3 pb-4 border-b border-dashed border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Tagihan</span>
                <span className="font-bold text-slate-700">
                  {billInfo ? formatRupiah(billInfo.details.totalTagihan) : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                <span className="font-bold text-green-700 text-sm">
                  Harus Dibayar (DP)
                </span>
                <span className="font-bold text-green-700 text-lg">
                  {billInfo
                    ? formatRupiah(billInfo.details.dpHarusDibayar)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Sisa Pelunasan</span>
                <span className="font-bold text-orange-600">
                  {billInfo
                    ? formatRupiah(billInfo.details.sisaPelunasan)
                    : "-"}
                </span>
              </div>
            </div>

            {/* Info Rekening */}
            <div className="text-center space-y-2 pt-2">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Transfer Bank Mandiri
              </p>

              <div
                className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 px-4 rounded-xl cursor-pointer hover:border-blue-400 transition-all group active:scale-95"
                onClick={handleCopyRekening}
              >
                <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-widest font-mono">
                  2345 7890 6511
                </span>
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-600">
                a.n. Nadifah Ramadhani
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: UPLOAD FORM */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-6 md:p-8 bg-white">
          <h3 className="font-bold text-gray-800 mb-4 text-center">
            Upload Bukti Transfer
          </h3>

          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors mb-4">
            {preview ? (
              <div className="relative w-full h-48">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs shadow-md hover:bg-red-600"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">
                  Klik untuk pilih gambar
                </p>
                <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Mengirim..." : "Konfirmasi Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpload;
