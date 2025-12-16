import axiosInstance from "@/lib/axios";

export interface ScheduleEvent {
  id: number;
  title: string;
  tanggal: string; // ISO Date String
  startTime: string; // "10:00"
  endTime: string; // "12:00"
  isBooked: boolean;
}

export const scheduleService = {
  // Ambil jadwal bulanan
  getMonthlySchedule: async (month: number, year: number) => {
    // Hitung tanggal awal dan akhir bulan
    // Contoh: month = 0 (Januari), year = 2025

    // Start: 2025-01-01
    const startDate = new Date(year, month, 1);

    // End: 2025-01-31 (Hari terakhir bulan tsb)
    const endDate = new Date(year, month + 1, 0);

    // Panggil API Backend
    const response = await axiosInstance.get("/schedule", {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    return response.data as ScheduleEvent[];
  },
};
