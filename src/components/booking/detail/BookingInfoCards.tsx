import React from "react";
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CalendarClock,
  User,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/format-utils";

// --- Sub-Card: Paket ---
export const PackageCard = ({
  layanan,
  konsep,
}: {
  layanan: any;
  konsep: any;
}) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-4 border-b pb-2">
      <FileText className="w-5 h-5 text-orange-500" /> Paket & Konsep
    </h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
          Layanan
        </p>
        <p className="font-bold text-slate-800 text-lg">{layanan.nama}</p>
        <p className="text-sm text-gray-500 mt-1">{layanan.deskripsi}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
          Konsep
        </p>
        <p className="font-bold text-slate-800 text-lg">{konsep.judul}</p>
        <p className="text-sm text-gray-500 mt-1">{konsep.deskripsi}</p>
      </div>
    </div>
  </div>
);

// --- Sub-Card: Jadwal ---
export const ScheduleCard = ({
  schedule,
  lokasi,
  status,
  onReschedule,
}: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4 border-b pb-2">
      <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800">
        <Calendar className="w-5 h-5 text-blue-500" /> Jadwal & Lokasi
      </h2>
      {status !== "completed" && status !== "cancelled" && (
        <button
          onClick={onReschedule}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <CalendarClock className="w-4 h-4" /> Ajukan Reschedule
        </button>
      )}
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Tanggal</p>
            <p className="text-slate-800">
              {formatDate(schedule?.tanggalBooking)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Waktu</p>
            <p className="text-slate-800">
              {formatTime(schedule?.startTime)} -{" "}
              {formatTime(schedule?.endTime)} WIB
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
        <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-700">Lokasi Shoot</p>
          <p className="text-slate-800 font-medium">
            {lokasi?.lokasi || "Belum ditentukan"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Card: Client ---
export const ClientCard = ({ client }: { client: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-4 border-b pb-2">
      <User className="w-5 h-5 text-purple-500" /> Informasi Klien
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-xs text-gray-400">Nama</p>
        <p className="font-medium text-slate-800">{client.clientName}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">No. HP</p>
        <p className="font-medium text-slate-800">{client.clientPhone}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Email</p>
        <p className="font-medium text-slate-800">{client.clientEmail}</p>
      </div>
    </div>
  </div>
);
