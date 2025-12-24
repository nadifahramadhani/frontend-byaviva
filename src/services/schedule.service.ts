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

// Helper: Menggabungkan Tanggal (ISO) + Jam (String "HH:mm")
const combineDateAndTime = (dateIso: string, timeStr: string | null): Date => {
  // 1. Buat object Date dari string ISO tanggal
  const date = new Date(dateIso);

  // 2. Jika timeStr ada (misal "10:00"), kita set jam & menitnya
  if (timeStr && timeStr.includes(":")) {
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Set jam lokal komputer user
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
  }

  return date;
};

// Helper: Mapping Category -> Warna
const getEventColor = (category: string) => {
  const cat = category.toUpperCase(); // Jaga-jaga casing beda
  if (cat === "BOOKING") return "pink";
  if (cat === "DISKUSI") return "blue";
  if (cat === "WORK") return "gray";
  return "gray"; // Default
};

export const fetchSchedules = async () => {
  try {
    const response = await axiosInstance.get("/schedule");
    const rawData = response.data;

    console.log("Raw Data dari Backend:", rawData); // Debugging 1

    const formattedEvents = rawData.map((item: any) => {
      // LOGIC PENGGABUNGAN TANGGAL
      const start = combineDateAndTime(item.tanggal, item.startTime);
      const end = combineDateAndTime(item.tanggal, item.endTime);

      return {
        id: item.id,
        title: item.title, // Contoh: "DISKUSI 2: Simon York"
        desc: item.deskripsi,
        start: start,
        end: end,
        type: getEventColor(item.category),
        resource: item, // Simpan data asli buat keperluan lain (misal modal detail)
      };
    });

    console.log("Data Siap Pakai di Kalender:", formattedEvents); // Debugging 2
    return formattedEvents;
  } catch (error) {
    console.error("Gagal fetch schedule:", error);
    return [];
  }
};

export const createSchedule = async (payload: any) => {
  try {
    // Sesuaikan endpoint dengan backend kamu
    const response = await axiosInstance.post("/schedule/add", payload);
    return response.data;
  } catch (error) {
    console.error("Gagal membuat jadwal:", error);
    throw error;
  }
};
