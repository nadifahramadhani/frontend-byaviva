"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  X,
  CalendarClock,
  Loader2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/format-utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  currentSchedule: any;
  onSuccess: () => void;
}

export const RescheduleModal = ({
  isOpen,
  onClose,
  bookingId,
  currentSchedule,
  onSuccess,
}: Props) => {
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  const TIME_SLOTS = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchCalendar();
      // Reset Form
      setSelectedDate("");
      setSelectedTime("");
      setRescheduleReason("");
    }
  }, [isOpen, bookingId]);

  const fetchCalendar = async () => {
    try {
      setIsLoadingCalendar(true);
      const res = await axiosInstance.get(`/reschedule/calendar/${bookingId}`);
      setCalendarData(res.data.calendar);
      setCalendarMonth(res.data.month);
      setCalendarYear(res.data.year);
    } catch (error) {
      console.error("Gagal ambil kalender:", error);
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !rescheduleReason)
      return alert("Lengkapi data!");

    try {
      setIsSubmitting(true);
      const finalDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      await axiosInstance.post(`/reschedule/${bookingId}`, {
        newDate: finalDateTime.toISOString(),
        alasan: rescheduleReason,
      });
      alert("Pengajuan berhasil!");
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengajukan reschedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMonthName = (monthIdx: number) => {
    const date = new Date();
    date.setMonth(monthIdx - 1);
    return date.toLocaleString("id-ID", { month: "long" });
  };

  if (!isOpen) return null;

  return (
    // WRAPPER UTAMA: Menggunakan items-center untuk desktop, tapi items-end untuk mobile (opsional, disini saya pakai center semua)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* CARD MODAL: Tambahkan max-h dan overflow hidden agar rapi */}
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER: Sticky di atas */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b bg-white shrink-0">
          <h3 className="text-lg font-bold text-slate-800">
            Ajukan Perubahan Jadwal
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* CONTENT BODY: Scrollable (overflow-y-auto) */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
          {/* 1. Info Jadwal Lama */}
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex flex-row items-start gap-3 md:gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm text-orange-600 shrink-0">
              <CalendarClock className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">
                Jadwal Saat Ini
              </p>
              <p className="text-sm md:text-lg font-bold text-slate-800">
                {formatDate(currentSchedule?.tanggalBooking)}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                Pukul {formatTime(currentSchedule?.startTime)} -{" "}
                {formatTime(currentSchedule?.endTime)} WIB
              </p>
            </div>
          </div>

          {/* 2. Kalender */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              1. Pilih Tanggal Baru
            </label>
            {isLoadingCalendar ? (
              <div className="h-56 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                {/* Header Bulan */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-800 text-sm md:text-base">
                    {getMonthName(calendarMonth)} {calendarYear}
                  </span>
                  {/* (Optional: Tombol prev/next bulan bisa ditambah disini nanti) */}
                </div>

                {/* Grid Hari */}
                {/* Grid Hari - Fix Key Duplicate */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
                  {["M", "S", "S", "R", "K", "J", "S"].map((d, index) => (
                    <span
                      key={index}
                      className="text-[10px] md:text-xs font-semibold text-gray-400"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Grid Tanggal - Dibuat Responsive */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {calendarData.map((day, idx) => {
                    const isSelected = selectedDate === day.date;
                    const isCurrent = day.status === "current";
                    const isFull = day.status === "full";
                    return (
                      <button
                        key={idx}
                        disabled={isFull || isCurrent}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                            h-9 w-full md:h-10 rounded-lg flex items-center justify-center text-xs md:text-sm font-medium transition-all 
                            ${
                              isSelected
                                ? "bg-slate-800 text-white shadow-md"
                                : ""
                            } 
                            ${
                              isCurrent
                                ? "bg-orange-100 text-orange-700 font-bold border border-orange-200"
                                : ""
                            } 
                            ${
                              isFull
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                : "hover:bg-gray-100 text-slate-700"
                            }
                          `}
                      >
                        {day.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Jam (Grid Responsive: 3 kolom di HP, 4 di Desktop) */}
          {selectedDate && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-slate-800 mb-3">
                2. Pilih Jam
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                        py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm font-bold border transition-all 
                        ${
                          selectedTime === time
                            ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200"
                            : "bg-white text-slate-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                        }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Alasan */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              3. Alasan
            </label>
            <textarea
              rows={3}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              placeholder="Contoh: Ada keperluan mendadak..."
            ></textarea>
          </div>
        </div>

        {/* FOOTER: Sticky di Bawah */}
        <div className="p-4 md:p-5 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !selectedDate ||
              !selectedTime ||
              !rescheduleReason
            }
            className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-2 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
        </div>
      </div>
    </div>
  );
};
