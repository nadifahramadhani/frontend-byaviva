import React from "react";
import { Wallet, CreditCard } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/format-utils";

interface Props {
  pricing: any;
  pembayaran: any[];
  status: string;
  onPayClick: () => void;
}

export const BookingFinancials = ({
  pricing,
  pembayaran,
  status,
  onPayClick,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-slate-50 p-6 border-b border-gray-200">
        <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800">
          <Wallet className="w-5 h-5 text-green-600" /> Keuangan
        </h2>
      </div>
      <div className="p-6">
        {/* Rincian */}
        <div className="space-y-3 pb-6 border-b border-dashed border-gray-300">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Rincian Tagihan
          </p>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Paket Layanan</span>
            <span>{formatRupiah(pricing.layananPrice)}</span>
          </div>
          {pricing.konsepPrice > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Add-on Konsep</span>
              <span>{formatRupiah(pricing.konsepPrice)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-slate-900 pt-2">
            <span>Total</span>
            <span>{formatRupiah(pricing.totalAmount)}</span>
          </div>
        </div>

        {/* Riwayat */}
        <div className="pt-6 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Riwayat Pembayaran
          </p>
          {pembayaran.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-lg text-sm text-gray-400 italic">
              Belum ada pembayaran.
            </div>
          ) : (
            pembayaran.map((pay) => (
              <div
                key={pay.id}
                className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div>
                  <p className="font-bold text-slate-700">{pay.tipe}</p>
                  <p className="text-[10px] text-gray-500">
                    {formatDate(pay.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">
                    {formatRupiah(pay.jumlah)}
                  </p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      pay.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {pay.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tombol Upload */}
      {status === "waiting_payment" && (
        <div className="p-4 bg-slate-50 border-t border-gray-200">
          <button
            onClick={onPayClick}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex justify-center items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Upload Pembayaran
          </button>
        </div>
      )}
    </div>
  );
};
