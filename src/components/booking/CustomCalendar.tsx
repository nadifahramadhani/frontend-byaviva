"use client";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface CustomCalendarProps {
  selected: Date | null;
  onSelect: (date: Date | undefined) => void;
  bookedDates?: Date[];
  onMonthChange?: (date: Date) => void;
  // Prop baru untuk batas tanggal maksimal (Logic Diskusi <= Shoot)
  maxDate?: Date | null;
}

export default function CustomCalendar({
  selected,
  onSelect,
  bookedDates = [],
  onMonthChange,
  maxDate,
}: CustomCalendarProps) {
  // Logic disabled:
  // 1. Tanggal sebelum hari ini (before: new Date())
  // 2. Tanggal setelah maxDate (jika maxDate ada) -> { after: maxDate }
  const disabledDays = [
    { before: new Date() },
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-center w-full">
      <style>{`
        .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #1e293b; --rdp-background-color: #fff7ed; margin: 0; }
        .rdp-caption_label { color: #1e293b; font-weight: 700; text-transform: uppercase; font-size: 0.875rem; }
        .rdp-head_cell { color: #94a3b8; font-weight: 500; font-size: 0.75rem; text-transform: uppercase; }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #fff7ed !important; color: #ea580c !important; font-weight: bold; }
        .rdp-day_today { color: #ea580c; font-weight: bold; }
        .rdp-day_selected { background-color: #1e293b !important; color: white !important; }
        
        /* INDIKATOR DOT (TITIK ORANYE) */
        .rdp-day_booked { font-weight: bold; color: #334155; }
        .rdp-day_booked::after { content: ''; display: block; width: 4px; height: 4px; background-color: #ea580c; border-radius: 50%; margin: 2px auto 0; }
        .rdp-day_selected.rdp-day_booked::after { background-color: white; }
      `}</style>

      <DayPicker
        mode="single"
        selected={selected || undefined}
        onSelect={onSelect}
        locale={id}
        onMonthChange={onMonthChange}
        modifiers={{ booked: bookedDates }}
        modifiersClassNames={{ booked: "rdp-day_booked" }}
        components={{
          IconLeft: () => (
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          ),
          IconRight: () => (
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          ),
        }}
        // Update di sini: Gabungkan logic disable default & maxDate
        disabled={disabledDays}
      />
    </div>
  );
}
