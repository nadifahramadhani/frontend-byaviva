"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import idID from "date-fns/locale/id";
import { isSameDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation"; // [BARU] 1. Import Router

const locales = { id: idID };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// --- CUSTOM COMPONENTS (Sama seperti sebelumnya) ---
const CustomToolbar = (toolbar: any) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToCurrent = () => toolbar.onNavigate("TODAY");

  const label = () => {
    const date = new Date(toolbar.date);
    if (toolbar.view === "month") {
      return format(date, "MMMM yyyy", { locale: idID });
    } else if (toolbar.view === "week") {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      return `Minggu ke-${format(start, "w")} (${format(date, "MMMM")})`;
    } else {
      return format(date, "d MMMM yyyy", { locale: idID });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-1">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight capitalize font-nunito-sans">
          {label()}
        </h2>
        <div className="flex gap-1 ml-2">
          <button
            onClick={goToBack}
            className="p-2 hover:bg-gray-100 rounded-full transition text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="p-2 hover:bg-gray-100 rounded-full transition text-slate-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 mt-3 md:mt-0">
        <button
          onClick={goToCurrent}
          className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition mr-2"
        >
          Today
        </button>
        {["month", "week", "day"].map((view) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={`px-5 py-2 text-xs font-bold rounded-lg capitalize transition ${
              toolbar.view === view
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-500 hover:bg-white hover:shadow-sm"
            }`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
};

const CustomEvent = ({ event, view }: any) => {
  const isMonthView = view === "month";

  // Style Dasar (Transisi halus saat hover)
  let baseStyle =
    "transition hover:brightness-95 cursor-pointer leading-tight w-full";

  if (isMonthView) {
    // --- TAMPILAN MONTH (Perbaikan Text Wrapping) ---
    let colorClass =
      "bg-white text-slate-700 border-l-[3px] border-slate-400 shadow-sm";
    if (event.type === "pink")
      colorClass =
        "bg-white text-pink-700 border-l-[3px] border-pink-500 shadow-sm";
    if (event.type === "blue")
      colorClass =
        "bg-white text-sky-700 border-l-[3px] border-sky-500 shadow-sm";

    return (
      <div
        className={`${baseStyle} ${colorClass} rounded-r px-1.5 py-0.5 mb-0.5 text-[10px] font-bold h-auto min-h-[22px] flex items-center`}
      >
        {/* break-words agar teks panjang turun ke bawah */}
        <span className="break-words whitespace-normal line-clamp-2">
          {event.title}
        </span>
      </div>
    );
  } else {
    // --- TAMPILAN WEEK/DAY (Perbaikan Text Size & Layout) ---
    let colorClass = "bg-slate-200 text-slate-800 border-l-4 border-slate-400";
    if (event.type === "pink")
      colorClass = "bg-[#FCE7F3] text-[#9D174D] border-l-4 border-pink-500";
    if (event.type === "blue")
      colorClass = "bg-[#E0F2FE] text-[#0369A1] border-l-4 border-sky-500";
    if (event.type === "gray")
      colorClass = "bg-[#F3F4F6] text-[#374151] border-l-4 border-gray-500";

    return (
      <div
        className={`h-full w-full ${baseStyle} ${colorClass} rounded-r-md flex flex-col p-1`}
      >
        {/* Judul: Font sedikit lebih kecil, max 3 baris */}
        <span className="font-extrabold text-[10px] md:text-[11px] line-clamp-3 mb-0.5">
          {event.title}
        </span>
        {/* Jam: Sangat kecil & transparan */}
        <span className="text-[9px] font-medium opacity-75 mt-auto">
          {format(new Date(event.start), "HH:mm")} -{" "}
          {format(new Date(event.end), "HH:mm")}
        </span>
      </div>
    );
  }
};

const CustomDateHeader = ({ label, date }: any) => {
  const isToday = isSameDay(date, new Date());
  return (
    <div className="flex justify-start pt-1 pl-1">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
          isToday
            ? "bg-blue-600 text-white shadow-md scale-110"
            : "text-slate-500 hover:bg-slate-100 cursor-pointer"
        }`}
      >
        {label}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
interface BigCalendarProps {
  events: any[];
}

export default function BigCalendar({ events }: BigCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date(2025, 11, 23));
  const router = useRouter(); // [BARU] 2. Inisialisasi Router

  // [BARU] 3. Fungsi saat Event diklik
  const handleSelectEvent = (event: any) => {
    // Cek apakah data booking tersedia di dalam resource
    // "resource" adalah data asli dari database yang kita simpan di service tadi
    const bookingId = event.resource?.bookingId;

    if (bookingId) {
      // Arahkan ke halaman detail booking
      // Sesuaikan URL ini dengan struktur folder kamu, misal: /admin/booking/[id]
      router.push(`/admin/booking/${bookingId}`);
    } else {
      console.log("Event ini tidak memiliki Booking ID (Mungkin event manual)");
      // Opsional: Bisa arahkan ke detail schedule biasa
      // router.push(`/admin/schedule/${event.id}`);
    }
  };
  // Debugging: Cek apakah props events masuk
  useEffect(() => {
    console.log("BigCalendar menerima events:", events);
  }, [events]);

  return (
    <Calendar
      localizer={localizer}
      events={events} // Pastikan ini terisi
      startAccessor="start"
      endAccessor="end"
      style={{ height: 800 }}
      view={view}
      onView={setView}
      date={date}
      onNavigate={setDate}
      min={new Date(0, 0, 0, 6, 0, 0)}
      max={new Date(0, 0, 0, 22, 0, 0)}
      onSelectEvent={handleSelectEvent}
      components={{
        toolbar: CustomToolbar,
        event: (props) => <CustomEvent {...props} view={view} />,
        month: { dateHeader: CustomDateHeader },
      }}
    />
  );
}
