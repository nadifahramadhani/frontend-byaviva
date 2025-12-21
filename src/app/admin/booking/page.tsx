"use client";

import React, { useState, useEffect } from "react";
import { FileText, Edit, RefreshCw, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { BookingTabs } from "@/components/admin/BookingTabs";
import { FilterActions } from "@/components/admin/FilterActions";
import { Pagination } from "@/components/ui/Pagination";
import axiosInstance from "@/lib/axios";
import { ColumnDef } from "@/types";
import { BookingAdminItem } from "@/types/booking";
import { InvoiceModal } from "@/components/booking/detail/InvoiceModal";
import { StatusUpdateModal } from "@/components/booking/detail/StatusUpdateModal";

export default function AdminBookingPage() {
  const router = useRouter();

  // --- STATE UTAMA ---
  const [bookings, setBookings] = useState<BookingAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE FILTER ---
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // 👇 STATE KHUSUS HITUNGAN (Agar angka tab tidak 0 saat pindah tab)
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

  // --- 1. CONFIGURATION (KOLOM TABEL) ---
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
      render: (item) => {
        if (!item.schedule?.tanggalBooking) return "-";
        return new Date(item.schedule.tanggalBooking).toLocaleDateString(
          "id-ID",
          { day: "2-digit", month: "2-digit", year: "numeric" }
        );
      },
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

        switch (item.status) {
          case "waiting_payment":
            colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
            label = "Pending";
            break;
          case "waiting_confirmation":
            colorClass = "bg-blue-100 text-blue-700 border-blue-200";
            label = "Confirming";
            break;
          case "dp_paid":
            colorClass = "bg-cyan-100 text-cyan-700 border-cyan-200";
            label = "DP Paid";
            break;
          case "in_progress":
            colorClass = "bg-purple-100 text-purple-700 border-purple-200";
            label = "In Progress";
            break;
          case "waiting_final":
            colorClass = "bg-orange-100 text-orange-700 border-orange-200";
            label = "Wait Final";
            break;
          case "paid":
            colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
            label = "Paid Full";
            break;
          case "completed":
            colorClass = "bg-green-100 text-green-700 border-green-200";
            label = "Completed";
            break;
          case "canceled":
            colorClass = "bg-red-100 text-red-700 border-red-200";
            label = "Canceled";
            break;
          case "rejected":
            colorClass = "bg-red-50 text-red-600 border-red-100";
            label = "Rejected";
            break;
        }

        const isFinal = ["completed", "canceled", "rejected"].includes(
          item.status
        );

        return (
          <button
            onClick={() => !isFinal && setSelectedUpdate(item)}
            disabled={isFinal}
            className={`group relative flex items-center justify-center gap-1 mx-auto px-3 py-1.5 rounded-lg text-xs font-bold border transition-all 
              ${colorClass} 
              ${
                !isFinal
                  ? "hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
                  : "opacity-80 cursor-not-allowed"
              }
            `}
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

  // --- 2. FETCH DATA UTAMA (UNTUK ISI TABEL) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Logic URL Switch
        let url = "/booking/admin/all";
        const params: any = { page, limit: 10, search: searchQuery };

        if (activeTab === "Upcoming") {
          url = "/booking/upcooming"; // Endpoint khusus Upcoming
        }

        const res = await axiosInstance.get(url, { params });

        let fetchedData = [];
        if (Array.isArray(res.data)) {
          // Case: Endpoint Upcoming (Return Array)
          fetchedData = res.data;
          setTotalPages(1);
        } else {
          // Case: Endpoint All (Return Paginated Object)
          fetchedData = res.data.data;
          setTotalPages(res.data.meta?.lastPage || 1);
        }

        setBookings(fetchedData);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, searchQuery, refreshTrigger, activeTab]);

  // --- 3. FETCH COUNTS (HITUNG SEMUA TAB) ---
  // Ini rahasianya agar angka tab tetap muncul!
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Panggil 3 API sekaligus (Parallel) biar cepat
        const [resUpcoming] = await Promise.all([
          // 3. Hitung Upcoming
          axiosInstance.get("/booking/upcooming"),
        ]);
        const totalUpcoming = Array.isArray(resUpcoming.data)
          ? resUpcoming.data.length
          : 0;

        // Simpan ke State 'tabCounts'
        setTabCounts({
          upcoming: totalUpcoming,
          reschedule: 0,
        });
      } catch (error) {
        console.error("Gagal load counts", error);
      }
    };

    fetchCounts();
  }, [refreshTrigger]); // Hitung ulang kalau ada update status

  // --- 4. FILTER LOGIC ---
  const filteredData = bookings.filter((item) => {
    if (activeTab === "Upcoming") return true; // Data sudah difilter backend
    if (activeTab === "all") return true;
    if (activeTab === "new") {
      return (
        item.status === "waiting_payment" ||
        item.status === "waiting_confirmation"
      );
    }
    if (activeTab === "reschedule") return false;
    return true;
  });

  // --- 5. CONFIG TAB (GUNAKAN STATE 'tabCounts') ---
  const tabConfig = [
    {
      id: "all",
      label: "All Booking",
      count: bookings.length,
    },

    {
      id: "new",
      label: "New Booking",
      count: bookings.filter(
        (b) =>
          b.status === "waiting_payment" || b.status === "waiting_confirmation"
      ).length,
    },
    {
      id: "Upcoming",
      label: "Upcoming (7 Days)",
      count: tabCounts.upcoming, // Ambil dari state (Konsisten)
    },
    {
      id: "reschedule",
      label: "Reschedule",
      count: tabCounts.reschedule,
    },
  ];

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden">
      <DashboardHeader
        title="Bookings"
        subtitle="Pantau booking client yang sedang berjalan disini"
      />

      <div className="flex-1 bg-[#F0F8FF] px-[40px] md:px-[60px] pb-10">
        <div className="w-full mt-6 bg-white rounded-[24px] p-10 border border-gray-100 shadow-sm min-h-[600px]">
          <BookingTabs
            tabs={tabConfig}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setPage(1);
            }}
          />

          <FilterActions />

          <div className="mt-8">
            {/* Tampilan Kosong untuk Upcoming */}
            {activeTab === "Upcoming" &&
              !isLoading &&
              bookings.length === 0 && (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-4">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold">
                    Tidak ada jadwal shooting dalam 7 hari kedepan.
                  </p>
                </div>
              )}

            <Table
              data={filteredData}
              columns={bookingColumns}
              isLoading={isLoading}
            />
          </div>

          <div className="w-full mt-6">
            {!isLoading && bookings.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* MODAL INVOICE */}
      {selectedInvoice && (
        <InvoiceModal
          bookingId={selectedInvoice.id}
          clientName={selectedInvoice.client.clientName}
          packageName={selectedInvoice.layanan.nama}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* MODAL STATUS UPDATE */}
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
