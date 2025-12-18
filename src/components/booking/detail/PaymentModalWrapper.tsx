import React from "react";
import { X } from "lucide-react";
import PaymentUpload from "../PaymentUpload";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  onSuccess: () => void;
}

export const PaymentModalWrapper = ({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        <div className="flex justify-between items-center p-5 border-b bg-white sticky top-0 z-10">
          <h3 className="text-lg font-bold text-slate-800">Pembayaran DP</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 md:p-6 bg-gray-50 max-h-[80vh] overflow-y-auto">
          <PaymentUpload transactionId={bookingId} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};
