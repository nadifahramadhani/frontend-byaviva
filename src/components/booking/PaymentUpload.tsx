// src/components/PaymentUpload.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import axios from "axios";
import { Copy, CheckCircle } from "lucide-react";

interface PaymentUploadProps {
  transactionId: number;
  onSuccess?: () => void;
}

const PaymentUpload = ({ transactionId, onSuccess }: PaymentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // State specific to bill info
  const { data: bookingData } = useBooking();
  const [billInfo, setBillInfo] = useState<any>(null);
  const [loadingBill, setLoadingBill] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Pilih file dulu!");

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Sesi habis atau belum login. Silakan login ulang.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const backendUrl = `http://localhost:3000/api/payments/dp/${transactionId}`;

      await axios.post(backendUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `http://localhost:3000/api/payments/bill-info/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    return <div className="text-center py-10">Memuat Detail Pesanan...</div>;

  return (
    // PARENT WRAPPER: Flex container untuk memisahkan kartu
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 font-montserrat">
      {/* CARD 1: BILL INFO */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Rincian Harga */}
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                  Total Tagihan
                </span>
                <span className="font-bold text-slate-800">
                  {billInfo ? formatRupiah(billInfo.details.totalTagihan) : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                <span className="font-semibold text-green-700">
                  Pembayaran DP
                </span>
                <span className="font-bold text-green-700">
                  {billInfo
                    ? formatRupiah(billInfo.details.dpHarusDibayar)
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center px-3">
                <span className="font-semibold text-gray-600">
                  Sisa Pembayaran
                </span>
                <span className="font-bold text-orange-600">
                  {billInfo
                    ? formatRupiah(billInfo.details.sisaPelunasan)
                    : "-"}
                </span>
              </div>
            </div>

            {/* Info Rekening */}
            <div className="w-full flex flex-col items-center gap-3 text-center bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
              <div className="text-sm font-semibold text-gray-600">
                Lakukan Pembayaran ke{" "}
                <span className="font-bold text-slate-900">Bank Mandiri</span>
              </div>

              <div className="w-full">
                <p className="text-xs text-gray-400 mb-1">No. Rekening</p>

                {/* Nomor Rekening + Tombol Copy */}
                <div
                  className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 px-4 rounded-lg cursor-pointer hover:border-orange-300 transition-colors group"
                  onClick={handleCopyRekening}
                  title="Klik untuk menyalin"
                >
                  <span className="text-2xl md:text-3xl font-bold text-slate-800 tracking-wider">
                    2345 7890 6511
                  </span>
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                  )}
                </div>
                <p className="text-xs text-green-600 mt-1 h-4">
                  {copied ? "Nomor rekening berhasil disalin!" : ""}
                </p>
              </div>

              <div className="text-sm font-medium text-gray-500">
                Atas Nama :{" "}
                <span className="text-slate-800 font-bold">
                  Nadifah Ramadhani
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: UPLOAD FORM */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div className="p-6 md:p-8 bg-gray-50">
          <h3 className="font-bold text-gray-800 mb-4 text-center">
            Upload Bukti DP
          </h3>

          {/* Preview Gambar */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300 mb-4"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-700 disabled:bg-gray-400 transition-all"
          >
            {loading ? "Mengirim..." : "Kirim Bukti Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpload;
