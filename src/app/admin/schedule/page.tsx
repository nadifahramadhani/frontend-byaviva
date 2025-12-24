"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import BigCalendar from "@/components/admin/schedule/BigCalendar";
import AddEventModal from "@/components/admin/schedule/AddEventModal"; // [BARU] Import Modal
import { Plus, Search, CalendarClock } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { fetchSchedules, createSchedule } from "@/services/schedule.service"; // [BARU] Import createSchedule

export default function AdminSchedulePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // [BARU] State Modal

  const router = useRouter();

  // Fungsi Load Data (Dipisahkan agar bisa dipanggil ulang setelah save)
  const loadData = async () => {
    try {
      // Jangan set isLoading(true) disini agar tidak flickering saat refresh data
      const data = await fetchSchedules();
      setEvents(data);
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, []);

  // [BARU] Fungsi Simpan Event dari Modal
  const handleSaveEvent = async (formData: any) => {
    try {
      // Panggil API Create
      await createSchedule(formData);

      // Refresh data kalender tanpa loading screen penuh
      await loadData();

      // Tutup modal otomatis dilakukan di dalam komponen modal saat sukses
      alert("Jadwal berhasil ditambahkan!");
    } catch (error) {
      alert("Gagal menambahkan jadwal. Cek console.");
    }
  };

  const handleNavigateToDetail = (event: any) => {
    const bookingId = event.resource?.bookingId;
    if (bookingId) {
      router.push(`/admin/booking/detail/${bookingId}`);
    }
  };

  const todayEvents = events.filter((evt: any) =>
    isSameDay(evt.start, new Date())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F8FF] rounded-tl-[40px]">
      <DashboardHeader
        title="Schedule"
        subtitle="Pantau kalender schedule kamu disini"
      />

      <div className="flex-1 px-4 md:px-8 pb-10">
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* KOLOM KIRI: KALENDER */}
          <div className="xl:col-span-3 flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 hidden md:block">
                Kalender Project
              </h3>
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari jadwal..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-slate-800 transition shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm flex-1 min-h-[600px] flex flex-col">
              {isLoading ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                  <p>Memuat Jadwal...</p>
                </div>
              ) : (
                <BigCalendar events={events} />
              )}
            </div>
          </div>

          {/* KOLOM KANAN: SIDEBAR */}
          <div className="xl:col-span-1 flex flex-col gap-6 pt-0 xl:pt-14">
            {/* TOMBOL ADD EVENT - [UPDATE] Pasang onClick */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-slate-800 text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 font-bold shadow-lg hover:bg-slate-700 transition active:scale-[0.98]"
            >
              <div className="bg-white/20 p-1 rounded-md">
                <Plus size={16} />
              </div>
              <span>Add New Event</span>
            </button>

            {/* WIDGET JADWAL HARI INI */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-5 sticky top-4 h-fit max-h-[calc(100vh-100px)]">
              <div className="text-center pb-4 border-b border-dashed border-gray-200 shrink-0">
                <h3 className="font-bold text-lg text-slate-800 flex items-center justify-center gap-2">
                  <CalendarClock className="w-5 h-5 text-slate-500" />
                  Jadwal Hari Ini
                </h3>
                <p className="text-sm font-medium text-gray-400 mt-1 capitalize">
                  {format(new Date(), "eeee, d MMMM yyyy", { locale: id })}
                </p>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event: any) => {
                    let borderColor = "bg-slate-400";
                    let hoverText = "group-hover:text-slate-600";
                    if (event.type === "pink") {
                      borderColor = "bg-pink-500";
                      hoverText = "group-hover:text-pink-600";
                    }
                    if (event.type === "blue") {
                      borderColor = "bg-sky-500";
                      hoverText = "group-hover:text-sky-600";
                    }

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleNavigateToDetail(event)}
                        className="group flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
                      >
                        <div
                          className={`w-1 self-stretch ${borderColor} rounded-full shrink-0`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-bold text-sm text-slate-800 ${hoverText} transition line-clamp-1`}
                          >
                            {event.title}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {event.desc || "Tidak ada deskripsi tambahan."}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${borderColor}`}
                            ></div>
                            <span className="text-[10px] font-bold text-slate-600 tracking-wide">
                              {format(event.start, "HH:mm")} -{" "}
                              {format(event.end, "HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <CalendarClock className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                      Tidak ada jadwal.
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                      Hari ini kosong, nikmati waktu luangmu!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* [BARU] MODAL DILETAKKAN DISINI */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
