"use client";
import { useBooking } from "@/context/BookingContext";
import CustomCalendar from "@/components/booking/CustomCalendar";
import { useState, useEffect } from "react";
import { scheduleService, ScheduleEvent } from "@/services/schedule.service";

// --- KOMPONEN DATE TIME PICKER ---
const DateTimePicker = ({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  optional = false,
  maxDate, // <--- PROP BARU
}: any) => {
  const [bookedEvents, setBookedEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date());

  const fetchSchedule = async (date: Date) => {
    setLoading(true);
    try {
      const events = await scheduleService.getMonthlySchedule(
        date.getMonth(),
        date.getFullYear()
      );
      setBookedEvents(events);
    } catch (error) {
      console.error("Gagal ambil jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(currentMonthView);
  }, [currentMonthView]);

  const bookedDates = bookedEvents.map((event) => new Date(event.tanggal));

  const isTimeDisabled = (time: string) => {
    if (!dateValue) return false;
    const eventsOnSelectedDate = bookedEvents.filter((event) => {
      const eventDate = new Date(event.tanggal).toDateString();
      const selectedDate = new Date(dateValue).toDateString();
      return eventDate === selectedDate;
    });

    return eventsOnSelectedDate.some((event: any) => {
      const start = event.startTime || event.start_time;
      const end = event.endTime || event.end_time;
      if (!start || !end) return false;
      return time >= start && time < end;
    });
  };

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-lg">{label}</h3>
        {optional && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">
            Opsional
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 w-full text-left">
            Pilih Tanggal{" "}
            {loading && (
              <span className="text-orange-500 font-normal ml-2 text-[10px] animate-pulse">
                Syncing...
              </span>
            )}
          </label>

          <CustomCalendar
            selected={dateValue}
            onSelect={onDateChange}
            bookedDates={bookedDates}
            onMonthChange={(month: Date) => setCurrentMonthView(month)}
            // PASS PROP MAXDATE KE CUSTOM CALENDAR
            maxDate={maxDate}
          />

          <div className="w-full flex items-center gap-2 mt-3 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
            <span>Tanggal ada jadwal (Klik untuk cek jam)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Pilih Waktu
          </label>
          <div className="grid grid-cols-4 gap-3">
            {timeSlots.map((time) => {
              const disabled = isTimeDisabled(time);
              return (
                <button
                  key={time}
                  onClick={() => !disabled && onTimeChange(time)}
                  disabled={disabled}
                  className={`
                    py-2.5 rounded-lg text-sm font-semibold transition-all border
                    ${
                      disabled
                        ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice line-through"
                        : timeValue === time
                        ? "bg-slate-800 text-white border-slate-800 shadow-lg transform scale-105"
                        : "bg-white text-slate-600 border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700"
                    }
                  `}
                >
                  {time}
                </button>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-slate-600">
            <p className="flex justify-between mb-1">
              <span>Tanggal:</span>
              <span className="font-bold text-slate-900">
                {formatDateDisplay(dateValue)}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Jam:</span>
              <span className="font-bold text-slate-900">
                {timeValue || "-"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA (Page Wrapper) ---
export default function Step2BookingData({ onNext }: { onNext: () => void }) {
  const { data, updateData } = useBooking();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const isValid =
    data.clientName &&
    data.clientEmail &&
    data.clientPhone &&
    data.lokasi &&
    data.shootDate &&
    data.shootTime &&
    data.discussion1Date &&
    data.discussion1Time;

  return (
    <div className="mx-auto pb-10">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800">Isi Data Booking</h3>
      </div>

      {/* Bagian Form Data Diri */}
      <div className="bg-white p-8 rounded-xl border shadow-sm mb-8">
        <h3 className="font-bold text-slate-800 text-lg mb-6 border-b pb-4">
          Informasi Client
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="clientName"
                value={data.clientName}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 border-gray-300"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                name="clientPhone"
                value={data.clientPhone}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 border-gray-300"
                placeholder="08..."
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Alamat Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={data.clientEmail}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 border-gray-300"
                placeholder="email@contoh.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Lokasi Shoot
              </label>
              <input
                type="text"
                name="lokasi"
                value={data.lokasi}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 border-gray-300"
                placeholder="Alamat Studio / Outdoor"
              />
            </div>
          </div>
        </div>
      </div>

      <DateTimePicker
        label="1. Jadwal Pemotretan (Shoot)"
        dateValue={data.shootDate}
        timeValue={data.shootTime}
        // Logic Reset Diskusi kalau Tanggal Shoot berubah mundur
        onDateChange={(date: Date) => {
          if (data.discussion1Date && date < data.discussion1Date) {
            updateData({
              shootDate: date,
              discussion1Date: null,
              discussion2Date: null,
            });
          } else {
            updateData({ shootDate: date });
          }
        }}
        onTimeChange={(time: string) => updateData({ shootTime: time })}
      />

      <DateTimePicker
        label="2. Jadwal Diskusi Awal"
        dateValue={data.discussion1Date}
        timeValue={data.discussion1Time}
        onDateChange={(date: Date) => updateData({ discussion1Date: date })}
        onTimeChange={(time: string) => updateData({ discussion1Time: time })}
        // LOGIC: Max Date = Tanggal Shoot
        maxDate={data.shootDate}
      />

      <DateTimePicker
        label="3. Jadwal Diskusi Lanjutan"
        optional={true}
        dateValue={data.discussion2Date}
        timeValue={data.discussion2Time}
        onDateChange={(date: Date) => updateData({ discussion2Date: date })}
        onTimeChange={(time: string) => updateData({ discussion2Time: time })}
        // LOGIC: Max Date = Tanggal Shoot
        maxDate={data.shootDate}
      />

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`
            px-12 py-3 rounded-full font-bold text-white transition-all shadow-xl
            ${
              isValid
                ? "bg-slate-800 hover:bg-slate-700 hover:scale-105"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }
          `}
        >
          Lanjut Pilih Paket &rarr;
        </button>
      </div>
    </div>
  );
}
