import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { mapStatus } from "@/lib/format-utils";

interface Props {
  bookingNumber: string;
  status: string;
}

export const BookingHeader = ({ bookingNumber, status }: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:mt-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Detail Booking</h1>
          <p className="text-sm text-gray-500">#{bookingNumber}</p>
        </div>
      </div>
      <div
        className={`px-4 py-2 rounded-lg font-bold border text-sm capitalize text-center ${mapStatus(
          status
        )}`}
      >
        {status.replace("_", " ")}
      </div>
    </div>
  );
};
