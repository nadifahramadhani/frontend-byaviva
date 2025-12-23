"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import axiosInstance from "@/lib/axios";
import { formatRupiah, formatDate } from "@/lib/format-utils";
import {
  Loader2,
  TrendingUp,
  Users,
  CreditCard,
  Search,
  FileText,
  ExternalLink,
  CalendarDays,
  Download,
  X, // Icon Close untuk Modal
} from "lucide-react";

import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ColumnDef } from "@/types";
import { InvoiceModal } from "@/components/booking/detail/InvoiceModal";
import { FilterActions } from "@/components/admin/FilterActions";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useRouter } from "next/navigation";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface HistoryItem {
  id: number;
  bookingNumber: string;
  status: string;
  createdAt: string;
  client: { clientName: string };
  layanan: { nama: string };
  schedule: { tanggalBooking: string };
  pricing: { totalAmount: number };
}

export default function AdminRiwayatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // --- STATE DATA ---
  const [summary, setSummary] = useState({
    totalPendapatan: 0,
    rincian: { dp: 0, pelunasan: 0 },
    rataRataPendapatan: 0,
    totalBooking: 0,
  });

  const [chartStatus, setChartStatus] = useState<any[]>([]);
  const [chartPackage, setChartPackage] = useState<any[]>([]);
  const [chartIncome, setChartIncome] = useState<any[]>([]);

  // --- STATE TABLE ---
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // --- FILTER & SORT ---
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPackage, setFilterPackage] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedInvoice, setSelectedInvoice] = useState<HistoryItem | null>(
    null
  );

  // 👇 STATE BARU: UNTUK MODAL EXPORT
  const [showExportModal, setShowExportModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // --- 1. FETCH STATS ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resSum, resStat, resPkg, resInc] = await Promise.all([
          axiosInstance.get("/booking/summary"),
          axiosInstance.get("/booking/chart-status"),
          axiosInstance.get("/booking/chart-package"),
          axiosInstance.get(`/booking/chart-income?year=${yearFilter}`),
        ]);
        setSummary(resSum.data);
        setChartStatus(
          resStat.data.map((item: any) => ({
            name: item.status.replace("_", " ").toUpperCase(),
            value: item._count.id,
          }))
        );
        setChartPackage(
          resPkg.data.map((item: any) => ({
            name: item.layananName,
            total: item._count.id,
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
        setChartIncome(
          resInc.data.data.map((val: number, idx: number) => ({
            name: months[idx],
            income: val,
          }))
        );
      } catch (error) {
        console.error("Gagal load stats:", error);
      }
    };
    fetchStats();
  }, [yearFilter]);

  // --- 2. FETCH HISTORY TABLE ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/booking/history", {
          params: {
            page,
            limit: 10,
            search,
            status: filterStatus !== "all" ? filterStatus : undefined,
            package: filterPackage !== "all" ? filterPackage : undefined,
            sort: sortBy,
          },
        });
        setHistoryData(res.data.data);
        setTotalPages(res.data.meta.lastPage);
      } catch (error) {
        console.error("Gagal load history:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchHistory(), 500);
    return () => clearTimeout(timeoutId);
  }, [page, search, filterStatus, filterPackage, sortBy]);

  // 👇 FUNGSI DOWNLOAD EXCEL (Dipanggil dari Modal)
  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);
      const response = await axiosInstance.get("/booking/history/export", {
        params: {
          search,
          status: filterStatus !== "all" ? filterStatus : undefined,
          package: filterPackage !== "all" ? filterPackage : undefined,
          sort: sortBy,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Booking_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowExportModal(false); // Tutup modal setelah download
    } catch (error) {
      console.error("Gagal download excel:", error);
      alert("Gagal mendownload laporan.");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- COLUMNS ---
  const historyColumns: ColumnDef<HistoryItem>[] = [
    {
      header: "No",
      className: "text-center w-[60px]",
      render: (_, index) => (page - 1) * 10 + index + 1,
    },
    {
      header: "Client",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">
            {item.client.clientName}
          </span>
          <span className="text-xs text-gray-400 font-normal font-mono">
            {item.bookingNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Paket & Tanggal",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">
            {item.layanan.nama}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(item.schedule?.tanggalBooking)}
          </span>
        </div>
      ),
    },
    {
      header: "Total",
      render: (item) => (
        <span className="font-bold text-slate-800">
          {formatRupiah(item.pricing.totalAmount)}
        </span>
      ),
    },
    {
      header: "Status",
      className: "text-center",
      render: (item) => {
        let style = "bg-gray-100 text-gray-600 border-gray-200";
        if (item.status === "completed")
          style = "bg-green-100 text-green-700 border-green-200";
        if (item.status === "canceled")
          style = "bg-gray-100 text-gray-600 border-gray-200";
        if (item.status === "rejected")
          style = "bg-red-100 text-red-700 border-red-200";
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${style}`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      className: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSelectedInvoice(item)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
            title="Lihat Invoice"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => router.push(`/admin/booking/${item.id}`)}
            className="flex items-center gap-1 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-800 hover:text-white transition"
          >
            <ExternalLink size={14} /> Detail
          </button>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F8FF]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden bg-[#F0F8FF]">
      <DashboardHeader
        title="Dashboard & Riwayat"
        subtitle="Analisis performa bisnis dan arsip data"
      />

      <div className="flex-1 px-[20px] md:px-[60px] pb-20 overflow-y-auto">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">
                  Total Pendapatan
                </p>
                <h3 className="text-xl font-extrabold text-slate-800">
                  {formatRupiah(summary.totalPendapatan)}
                </h3>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-gray-100 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">DP :</span>
                <span className="font-bold text-slate-700">
                  {formatRupiah(summary.rincian?.dp || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Lunas :</span>
                <span className="font-bold text-green-600">
                  {formatRupiah(summary.rincian?.pelunasan || 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">
                Rata-rata / Booking
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">
                {formatRupiah(summary.rataRataPendapatan)}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">
                Total Booking
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">
                {summary.totalBooking}{" "}
                <span className="text-sm font-normal text-gray-400">
                  Project
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* CHARTS (Disembunyikan detailnya biar ringkas, kodenya sama persis) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">
                Tren Pendapatan Bulanan
              </h3>
              <select
                className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 outline-none cursor-pointer"
                value={yearFilter}
                onChange={(e) => setYearFilter(Number(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <div className="h-[300px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartIncome}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
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
                  <Tooltip formatter={(value: number) => formatRupiah(value)} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="h-[250px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartPackage} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#eee"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#8884d8"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    {chartPackage.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="h-[250px] w-full text-xs flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3: TABLE RIWAYAT */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 self-start md:self-center">
              <FileText className="w-5 h-5 text-slate-500" />
              Arsip Riwayat Booking
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari Client / No. Booking..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <FilterActions
                  onStatusChange={(val) => {
                    setFilterStatus(val);
                    setPage(1);
                  }}
                  onPackageChange={(val) => {
                    setFilterPackage(val);
                    setPage(1);
                  }}
                  onSortChange={(val) => {
                    setSortBy(val);
                    setPage(1);
                  }}
                  packageOptions={chartPackage.map((p) => ({
                    label: p.name,
                    value: p.name,
                  }))}
                />
              </div>

              {/* 👇 TOMBOL EXPORT (Hanya Button Saja) */}
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm w-full sm:w-auto"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full px-7">
            {!loading && historyData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 bg-gray-50/50 m-6 rounded-xl border border-dashed border-gray-200">
                <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-semibold text-sm">
                  Tidak ada data riwayat ditemukan.
                </p>
              </div>
            ) : (
              <div className="w-full">
                <Table
                  data={historyData}
                  columns={historyColumns}
                  isLoading={loading}
                />
              </div>
            )}
          </div>

          {!loading && historyData.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          bookingId={selectedInvoice.id}
          clientName={selectedInvoice.client.clientName}
          packageName={selectedInvoice.layanan.nama}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* 👇 MODAL EXPORT EXCEL (POP UP BARU) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" />
                Export Laporan Excel
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Pilih rentang tanggal untuk data yang ingin diunduh. Kosongkan
                untuk mengunduh semua data.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-gray-200 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleDownloadExcel}
                disabled={isDownloading}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition disabled:opacity-70 flex items-center gap-2"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? "Mengunduh..." : "Download Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
