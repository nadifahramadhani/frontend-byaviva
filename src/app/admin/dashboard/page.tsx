"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import axiosInstance from "@/lib/axios";
import { formatRupiah, formatDate } from "@/lib/format-utils";
import {
  Users,
  CreditCard,
  CalendarCheck,
  Clock,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  CalendarClock, // Icon baru
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";
import { format, isSameDay } from "date-fns"; // Untuk tanggal
import { id } from "date-fns/locale"; // Locale Indo
import { fetchSchedules } from "@/services/schedule.service"; // Service Schedule

// Warna untuk Chart
const COLORS = ["#EC4899", "#3B82F6", "#F59E0B", "#64748B", "#10B981"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // --- STATE DATA ---
  const [summary, setSummary] = useState({
    totalPendapatan: 0,
    rincian: { dp: 0, pelunasan: 0 },
    rataRataPendapatan: 0,
    totalBooking: 0,
  });

  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [packageData, setPackageData] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // [BARU] State Jadwal Hari Ini
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);

  // --- FETCH DASHBOARD DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Panggil API secara paralel (Termasuk fetchSchedules)
        const [resSum, resStat, resPkg, resInc, resNewest, resSchedule] =
          await Promise.all([
            axiosInstance.get("/booking/summary"),
            axiosInstance.get("/booking/chart-status"),
            axiosInstance.get("/booking/chart-package"),
            axiosInstance.get(`/booking/chart-income?year=${yearFilter}`),
            axiosInstance.get("/booking/admin/all", {
              params: { page: 1, limit: 5, sort: "newest" },
            }),
            fetchSchedules(), // [BARU] Ambil data jadwal
          ]);

        // 1. Set Summary & Charts (Sama seperti sebelumnya)
        setSummary(resSum.data);

        const statusList = resStat.data;
        const waitingPayment =
          statusList.find((s: any) => s.status === "waiting_payment")?._count
            .id || 0;
        const waitingConfirm =
          statusList.find((s: any) => s.status === "waiting_confirmation")
            ?._count.id || 0;
        setPendingCount(waitingPayment + waitingConfirm);

        setPackageData(
          resPkg.data.map((item: any) => ({
            name: item.layananName,
            value: item._count.id,
          }))
        );

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Ags",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];
        setIncomeData(
          resInc.data.data.map((val: number, idx: number) => ({
            name: months[idx],
            total: val,
          }))
        );

        const rawBookingData = resNewest.data.data || resNewest.data || [];
        setRecentBookings(rawBookingData);

        // [BARU] Filter Jadwal Hari Ini
        const allEvents = resSchedule;
        const today = allEvents.filter((evt: any) =>
          isSameDay(evt.start, new Date())
        );
        setTodaySchedules(today);
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [yearFilter]);

  // Helper warna status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting_payment":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "waiting_confirmation":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "dp_paid":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "canceled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F8FF]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden bg-[#F0F8FF]">
      <DashboardHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas studio Anda hari ini"
      />

      <div className="flex-1 px-4 md:px-8 pb-10 overflow-y-auto custom-scrollbar">
        {/* 1. STATS CARDS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Card 1: Pendapatan */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 group-hover:text-blue-500 transition">
                  Total Pendapatan
                </p>
                <h3 className="text-xl xl:text-2xl font-bold text-slate-800 mt-2">
                  {formatRupiah(summary.totalPendapatan)}
                </h3>
              </div>
              <div className="p-3 rounded-2xl shadow-lg shadow-blue-50 bg-blue-500 text-white">
                <CreditCard size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1">
                <TrendingUp size={12} /> DP: {formatRupiah(summary.rincian.dp)}
              </span>
            </div>
          </div>

          {/* Card 2: Booking */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 group-hover:text-pink-500 transition">
                  Total Booking
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">
                  {summary.totalBooking}
                </h3>
              </div>
              <div className="p-3 rounded-2xl shadow-lg shadow-pink-50 bg-pink-500 text-white">
                <CalendarCheck size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                {summary.totalBooking} Project
              </span>
            </div>
          </div>

          {/* Card 3: Rata-rata */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 group-hover:text-orange-500 transition">
                  Rata-rata / Project
                </p>
                <h3 className="text-xl font-bold text-slate-800 mt-2">
                  {formatRupiah(summary.rataRataPendapatan)}
                </h3>
              </div>
              <div className="p-3 rounded-2xl shadow-lg shadow-orange-50 bg-orange-500 text-white">
                <Users size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-gray-400">Estimasi per client</span>
            </div>
          </div>

          {/* Card 4: Pending */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 group-hover:text-slate-800 transition">
                  Butuh Tindakan
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">
                  {pendingCount}
                </h3>
              </div>
              <div className="p-3 rounded-2xl shadow-lg shadow-gray-100 bg-slate-800 text-white">
                <Clock size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {pendingCount > 0 ? (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-600 animate-pulse flex items-center gap-1">
                  <AlertCircle size={12} /> Segera Proses
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600">
                  Aman
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. LAYOUT GRID UTAMA (SPLIT KIRI & KANAN) */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* --- KOLOM KIRI (LEBAR) --- */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* A. REVENUE CHART */}
            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Analitik Pendapatan
                  </h3>
                  <p className="text-sm text-gray-400">
                    Grafik pemasukan tahun {yearFilter}
                  </p>
                </div>
                <select
                  className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 outline-none cursor-pointer font-bold text-slate-600"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(Number(e.target.value))}
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
              <div className="h-[300px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeData}>
                    <defs>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8" }}
                      tickFormatter={(val) => `${val / 1000000}jt`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatRupiah(value)}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* B. RECENT BOOKINGS TABLE */}
            <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Booking Terbaru
                  </h3>
                  <p className="text-sm text-gray-400">
                    Daftar booking yang baru masuk
                  </p>
                </div>
                <button
                  onClick={() => router.push("/admin/booking")}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                >
                  Lihat Semua <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 pl-2">Klien</th>
                      <th className="pb-3">Layanan</th>
                      <th className="pb-3 text-right">Total</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right pr-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700">
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 pl-2">
                            <div className="font-bold text-slate-800">
                              {booking.client.clientName}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              {booking.bookingNumber}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="font-semibold text-slate-600">
                              {booking.layanan.nama}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(booking.schedule.tanggalBooking)}
                            </div>
                          </td>
                          <td className="py-4 text-right font-bold text-slate-800">
                            {formatRupiah(booking.layanan.harga)}
                          </td>
                          <td className="py-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-2">
                            <button
                              onClick={() =>
                                router.push(`/admin/booking/${booking.id}`)
                              }
                              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          Belum ada booking terbaru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN (SIDEBAR) --- */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* C. [BARU] JADWAL HARI INI */}
            <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm flex flex-col h-[400px]">
              {" "}
              {/* Tinggi fix agar rapi */}
              <div className="text-center pb-4 border-b border-dashed border-gray-200 shrink-0">
                <h3 className="font-bold text-lg text-slate-800 flex items-center justify-center gap-2">
                  <CalendarClock className="w-5 h-5 text-slate-500" />
                  Jadwal Hari Ini
                </h3>
                <p className="text-sm font-medium text-gray-400 mt-1 capitalize">
                  {format(new Date(), "eeee, d MMMM yyyy", { locale: id })}
                </p>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 mt-4 flex-1">
                {todaySchedules.length > 0 ? (
                  todaySchedules.map((event: any) => {
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
                    if (event.type === "work") {
                      borderColor = "bg-slate-800";
                      hoverText = "group-hover:text-slate-800";
                    }

                    return (
                      <div
                        key={event.id}
                        onClick={() => {
                          if (event.resource?.bookingId)
                            router.push(
                              `/admin/booking/detail/${event.resource.bookingId}`
                            );
                        }}
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
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
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
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <CalendarClock className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                      Tidak ada jadwal.
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                      Hari ini kosong.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* D. PIE CHART */}
            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Paket Terlaris
              </h3>
              <p className="text-sm text-gray-400 mb-6">Distribusi layanan</p>
              <div className="flex-1 min-h-[200px] relative text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {packageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-slate-800">
                      {summary.totalBooking}
                    </span>
                    <span className="text-xs text-gray-400">Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
