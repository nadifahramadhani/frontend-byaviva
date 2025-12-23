"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  RefreshCw,
  CalendarDays,
  ArrowRight,
  ExternalLink,
  Search, // Icon Search
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { BookingTabs } from "@/components/admin/BookingTabs";
// Pastikan FilterActions menerima props yang sudah kita update sebelumnya
import { FilterActions } from "@/components/admin/FilterActions";
import { Pagination } from "@/components/ui/Pagination";
import axiosInstance from "@/lib/axios";
import { ColumnDef } from "@/types";
import { BookingAdminItem } from "@/types/booking";
import { InvoiceModal } from "@/components/booking/detail/InvoiceModal";
import { StatusUpdateModal } from "@/components/booking/detail/StatusUpdateModal";
import { formatDate } from "@/lib/format-utils";

// Interface Reschedule
interface RescheduleItem {
  id: number;
  oldDate: string;
  newDate: string;
  alasan: string;
  status: string;
  booking: {
    id: number;
    bookingNumber: string;
    client: { clientName: string };
  };
}

export default function AdminBookingPage() {
  const router = useRouter();

  // --- STATE UTAMA ---
  const [bookings, setBookings] = useState<BookingAdminItem[]>([]);
  const [rescheduleList, setRescheduleList] = useState<RescheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE NAVIGASI & FILTER ---
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. STATE FILTER (AKTIF)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPackage, setFilterPackage] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const bookingStatusOptions = [
    { label: "Menunggu Bayar (Waiting Payment)", value: "waiting_payment" },
    { label: "DP Lunas (DP Paid)", value: "dp_paid" },
    { label: "Sedang Berjalan (In Progress)", value: "in_progress" },
    { label: "Menunggu Pelunasan (Waiting Final)", value: "waiting_final" },
    { label: "Lunas (Paid)", value: "paid" },
  ];

  // --- STATE HITUNGAN ---
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    new: 0,
    upcoming: 0,
    reschedule: 0,
  });

  // --- STATE MODAL ---
  const [selectedInvoice, setSelectedInvoice] =
    useState<BookingAdminItem | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<BookingAdminItem | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // [HELPER] Extract Data
  const extractData = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  // --- 2. FETCH DATA UTAMA (DENGAN FILTER) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // A. LOGIKA FETCH RESCHEDULE
        if (activeTab === "reschedule") {
          const res = await axiosInstance.get("/reschedule/allReschedule");
          const safeData = extractData(res);
          setRescheduleList(safeData);
          setTotalPages(1); // Reschedule endpoint belum ada pagination di backend
        }

        // B. LOGIKA FETCH BOOKING BIASA
        else {
          let url = "/booking/admin/all";

          // Parameter Standar
          const params: any = {
            page,
            limit: 10,
            search: searchQuery,
            // Kirim Filter ke Backend
            sort: sortBy,
            package: filterPackage !== "all" ? filterPackage : undefined,
          };

          // Logic URL Berdasarkan Tab
          if (activeTab === "Upcoming") {
            url = "/booking/upcooming";
          } else if (activeTab === "new") {
            // Jika Tab "New", filter status spesifik (New Booking)
            // Tapi jika user memilih filter status lain di dropdown, filter dropdown menang.
            // Strategi: Jika filterStatus 'all', kita paksa status 'new'.
            // Jika user pilih 'canceled', kita tampilkan canceled (di dalam tab new - opsional logicnya)
            // Sederhananya: Tab New memfilter status "waiting_payment/confirmation"
            params.status = filterStatus !== "all" ? filterStatus : undefined; // Biarkan backend handle atau override di bawah
            // Note: Biasanya endpoint /admin/all bisa terima array status, tapi untuk simpel
            // Kita serahkan filtering "New" ke Frontend filter logic atau backend support
          } else {
            // Tab "All"
            params.status = filterStatus !== "all" ? filterStatus : undefined;
          }

          const res = await axiosInstance.get(url, { params });
          const safeData = extractData(res);
          setBookings(safeData);

          // Pagination
          setTotalPages(res.data?.meta?.lastPage || 1);
        }
      } catch (err) {
        console.error("Gagal ambil data:", err);
        setBookings([]);
        setRescheduleList([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce Search agar tidak spam API
    const timeoutId = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timeoutId);
  }, [
    page,
    searchQuery,
    refreshTrigger,
    activeTab,
    filterStatus,
    filterPackage,
    sortBy,
  ]);

  // --- 3. FETCH COUNTS ---
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [resAll, resUpcoming, resReschedule] = await Promise.all([
          axiosInstance.get("/booking/admin/all", { params: { limit: 100 } }), // Ambil cukup banyak untuk sampling count
          axiosInstance.get("/booking/upcooming"),
          axiosInstance.get("/reschedule/allReschedule"),
        ]);

        const allDataList = extractData(resAll);

        // Hitung Active (All)
        const totalActive = allDataList.length; // Atau filter status aktif jika perlu

        // Hitung New
        const totalNew = allDataList.filter((item: BookingAdminItem) =>
          ["waiting_payment", "waiting_confirmation"].includes(item.status)
        ).length;

        // Hitung Reschedule
        const rescheduleListData = extractData(resReschedule);
        const totalReschedule = rescheduleListData.filter(
          (r: any) => r.status === "pending"
        ).length;

        setTabCounts({
          all: totalActive,
          new: totalNew,
          upcoming: extractData(resUpcoming).length,
          reschedule: totalReschedule,
        });
      } catch (error) {
        console.error("Gagal load counts", error);
      }
    };

    fetchCounts();
  }, [refreshTrigger]);

  // --- 4. CLIENT SIDE FILTERING (OPSIONAL / PELENGKAP) ---
  // Kita gunakan ini HANYA untuk memastikan data sesuai Tab jika Backend belum support filter status kompleks
  const filteredBookingData = bookings.filter((item) => {
    if (activeTab === "reschedule") return false;
    if (activeTab === "Upcoming") return true; // Upcoming sudah difilter endpoint

    // Tab "New Booking" -> Hanya tampilkan yg baru
    if (activeTab === "new") {
      // Jika user memfilter status 'completed' saat di tab 'new', hasilnya kosong (benar)
      const isNewStatus = ["waiting_payment", "waiting_confirmation"].includes(
        item.status
      );

      // Jika filter dropdown 'all', tampilkan hanya new status
      if (filterStatus === "all") return isNewStatus;

      // Jika filter dropdown dipilih, biarkan API yang handle (return true)
      // atau strict match (return item.status === filterStatus && isNewStatus)
      return item.status === filterStatus && isNewStatus;
    }

    return true; // Tab "All" menampilkan semua hasil dari API
  });

  const currentData =
    activeTab === "reschedule" ? rescheduleList : filteredBookingData;

  // --- 5. CONFIG TAB ---
  const tabConfig = [
    { id: "all", label: "All Booking", count: tabCounts.all },
    { id: "new", label: "New Booking", count: tabCounts.new },
    { id: "Upcoming", label: "Upcoming (7 Days)", count: tabCounts.upcoming },
    { id: "reschedule", label: "Reschedule", count: tabCounts.reschedule },
  ];

  // --- CONFIG COLUMNS (SAMA PERSIS) ---
  const bookingColumns: ColumnDef<BookingAdminItem>[] = [
    {
      header: "No",
      className: "text-center w-[60px]",
      render: (_, index) => (page - 1) * 10 + index + 1,
    },
    {
      header: "Nama",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">
            {item.client.clientName}
          </span>
          <span className="text-xs text-gray-400 font-normal">
            {item.bookingNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Tanggal",
      render: (item) =>
        item.schedule?.tanggalBooking
          ? formatDate(item.schedule.tanggalBooking)
          : "-",
    },
    {
      header: "Lokasi",
      className: "text-left max-w-[200px]",
      render: (item) => (
        <span className="text-slate-700 text-sm font-semibold block leading-tight">
          {item.lokasi?.lokasi || "-"}
        </span>
      ),
    },
    {
      header: "Paket",
      render: (item) => (
        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold font-nunito-sans">
          {item.layanan.nama}
        </span>
      ),
    },
    {
      header: "Total",
      render: (item) => (
        <span className="font-bold text-slate-800">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(item.layanan.harga)}
        </span>
      ),
    },
    {
      header: "Status",
      className: "text-center",
      render: (item) => {
        let colorClass = "bg-gray-100 text-gray-600 border-gray-200";
        let label = item.status.replace("_", " ");
        if (item.status === "waiting_payment")
          colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
        else if (item.status === "waiting_confirmation")
          colorClass = "bg-blue-100 text-blue-700 border-blue-200";
        else if (item.status === "dp_paid")
          colorClass = "bg-cyan-100 text-cyan-700 border-cyan-200";
        else if (item.status === "in_progress")
          colorClass = "bg-purple-100 text-purple-700 border-purple-200";
        else if (item.status === "waiting_final")
          colorClass = "bg-orange-100 text-orange-700 border-orange-200";
        else if (item.status === "paid")
          colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
        else if (item.status === "completed")
          colorClass = "bg-green-100 text-green-700 border-green-200";
        else if (item.status === "canceled")
          colorClass = "bg-red-100 text-red-700 border-red-200";
        else if (item.status === "rejected")
          colorClass = "bg-red-50 text-red-600 border-red-100";

        const isFinal = ["completed", "canceled", "rejected"].includes(
          item.status
        );

        return (
          <button
            onClick={() => !isFinal && setSelectedUpdate(item)}
            disabled={isFinal}
            className={`group relative flex items-center justify-center gap-1 mx-auto px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${colorClass} ${
              !isFinal
                ? "hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
                : "opacity-80 cursor-not-allowed"
            }`}
            title={!isFinal ? "Klik untuk update status" : "Status Final"}
          >
            <span className="capitalize font-nunito-sans whitespace-nowrap">
              {label}
            </span>
            {!isFinal && (
              <RefreshCw
                size={10}
                className="hidden group-hover:block animate-spin-once"
              />
            )}
          </button>
        );
      },
    },
    {
      header: "Invoice",
      className: "text-center",
      render: (item) => (
        <button
          onClick={() => setSelectedInvoice(item)}
          className="flex items-center justify-center gap-1.5 bg-[#335C67] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-opacity-90 transition mx-auto font-nunito-sans"
        >
          <FileText size={14} /> See
        </button>
      ),
    },
    {
      header: "Aksi",
      className: "text-center",
      render: (item) => (
        <button
          onClick={() => router.push(`/admin/booking/${item.id}`)}
          className="flex items-center justify-center gap-1.5 border border-slate-300 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-100 transition mx-auto font-nunito-sans"
        >
          <Edit size={14} /> Detail
        </button>
      ),
    },
  ];

  const rescheduleColumns: ColumnDef<RescheduleItem>[] = [
    {
      header: "No",
      className: "text-center w-[60px]",
      render: (_, index) => index + 1,
    },
    {
      header: "Client",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">
            {item.booking?.client?.clientName || "Unknown"}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {item.booking?.bookingNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Jadwal",
      className: "min-w-[250px]",
      render: (item) => (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-red-500 line-through decoration-red-300">
            {formatDate(item.oldDate)}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-green-600">
            {formatDate(item.newDate)}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      className: "text-center",
      render: (item) => {
        const style =
          item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : item.status === "approved"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
        return (
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${style}`}
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
        <button
          onClick={() => router.push(`/admin/booking/reschedule/${item.id}`)}
          className="flex items-center justify-center gap-1.5 border border-slate-300 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-800 hover:text-white transition mx-auto"
        >
          <ExternalLink size={14} /> Review
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden">
      <DashboardHeader
        title="Bookings"
        subtitle="Pantau booking client yang sedang berjalan disini"
      />

      <div className="flex-1 bg-[#F0F8FF] px-[20px] md:px-[60px] pb-10">
        <div className="w-full mt-6 bg-white rounded-[24px] p-10 border border-gray-100 shadow-sm min-h-[600px]">
          <BookingTabs
            tabs={tabConfig}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setPage(1);
            }}
          />

          {/* HEADER CONTROLS (SEARCH & FILTER) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 mb-4">
            {/* 1. Search Bar */}
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari Client / No. Booking..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* 2. Filter Actions (AKTIF) */}
            {activeTab !== "reschedule" && (
              <div className="flex-shrink-0 w-full md:w-auto">
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
                  // 👇 KIRIM OPSINYA DISINI
                  statusOptions={bookingStatusOptions}
                />
              </div>
            )}
          </div>

          <div>
            {!isLoading && currentData.length === 0 && (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-4">
                <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-semibold">Tidak ada data untuk tab ini.</p>
                <p className="text-xs mt-1">
                  Coba reset filter atau ubah kata kunci pencarian.
                </p>
              </div>
            )}

            {/* SWITCH TABLE RENDER */}
            {activeTab === "reschedule" ? (
              <Table
                data={rescheduleList}
                columns={rescheduleColumns}
                isLoading={isLoading}
              />
            ) : (
              <Table
                data={filteredBookingData}
                columns={bookingColumns}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="w-full mt-6">
            {!isLoading &&
              currentData.length > 0 &&
              activeTab !== "reschedule" && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
          </div>
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

      {selectedUpdate && (
        <StatusUpdateModal
          bookingId={selectedUpdate.id}
          currentStatus={selectedUpdate.status}
          onClose={() => setSelectedUpdate(null)}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
