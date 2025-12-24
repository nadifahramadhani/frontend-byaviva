"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Image as ImageIcon,
  Loader2,
  CalendarDays,
  Power, // Icon Power untuk status
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { BookingTabs } from "@/components/admin/BookingTabs";
import { FilterActions } from "@/components/admin/FilterActions";
import { Pagination } from "@/components/ui/Pagination";
import { formatRupiah } from "@/lib/format-utils";

import {
  fetchPackages,
  updatePackage,
  deletePackage,
  fetchConcepts,
  updateConcept,
  deleteConcept, // [BARU]
} from "@/services/admin-service.service";
import EditPackageModal from "@/components/admin/service/EditPackageModal";
import AddPackageModal from "@/components/admin/service/AddPackageModal";
import AddConceptModal from "@/components/admin/service/AddConceptModal";
import EditConceptModal from "@/components/admin/service/EditConceptModal";

// Dummy Data untuk Tab Konsep (Placeholder)

export default function AdminServicePage() {
  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("paket");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Data State
  const [dataList, setDataList] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);

  // State loading khusus untuk toggle agar user tidak spam klik
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // [BARU] Modal States Konsep
  const [isAddConceptOpen, setIsAddConceptOpen] = useState(false);
  const [isEditConceptOpen, setIsEditConceptOpen] = useState(false);
  const [editConceptData, setEditConceptData] = useState<any>(null);
  // --- TAB CONFIG ---
  const tabConfig = [
    {
      id: "paket",
      label: "Paket Layanan",
      count: rawData.filter((item) => item.isActive).length,
    },
    {
      id: "konsep",
      label: "Konsep Foto",
      count: rawData.filter((item) => item.isActive).length,
    },
  ];

  // --- FETCH DATA FUNCTION ---
  const loadData = async () => {
    setIsLoading(true);
    try {
      let result = [];

      if (activeTab === "paket") {
        result = await fetchPackages();
      } else {
        // [BARU] Fetch Konsep dari API
        result = await fetchConcepts();
      }

      setRawData(result);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    if (activeTab === "paket") {
      setIsAddModalOpen(true);
    } else {
      setIsAddConceptOpen(true); // Buka modal konsep
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // --- LOGIC FILTER & SORT ---
  useEffect(() => {
    let processed = [...rawData];

    // 1. Search
    if (searchQuery) {
      processed = processed.filter((item) =>
        item.judul?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Sorting
    if (sortBy === "oldest") {
      processed.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "newest") {
      processed.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "price_high" || sortBy === "price_low") {
      processed.sort((a, b) => {
        const priceA = a.harga || a.layanans?.[0]?.harga || 0;
        const priceB = b.harga || b.layanans?.[0]?.harga || 0;
        return sortBy === "price_high" ? priceB - priceA : priceA - priceB;
      });
    }

    // 3. Pagination
    const itemsPerPage = 5;
    setTotalPages(Math.ceil(processed.length / itemsPerPage));
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = processed.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setDataList(paginatedData);
  }, [rawData, searchQuery, sortBy, page]);

  // --- [BARU] HANDLE TOGGLE STATUS ---
  const handleToggleStatus = async (item: any) => {
    if (togglingId === item.id) return;
    setTogglingId(item.id);
    const newStatus = !item.isActive;

    try {
      if (activeTab === "paket") {
        await updatePackage(item.id, { isActive: newStatus });
      } else {
        // [BARU] Update Konsep
        await updateConcept(item.id, { isActive: newStatus });
      }

      const updatedRaw = rawData.map((d) =>
        d.id === item.id ? { ...d, isActive: newStatus } : d
      );
      setRawData(updatedRaw);
    } catch (error) {
      alert("Gagal update status.");
    } finally {
      setTogglingId(null);
    }
  };

  // --- COLUMNS DEFINITION ---
  const packageColumns = [
    {
      header: "No",
      className: "text-center w-[60px] align-top",
      render: (_: any, index: number) => (page - 1) * 5 + index + 1,
    },

    // [BARU] Kolom Foto
    {
      header: "Foto",
      className: "w-[100px] align-top", // Lebar fix biar rapi
      render: (item: any) => (
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
          {item.fotoUrl ? (
            <img
              src={item.fotoUrl}
              alt={item.judul}
              className="w-full h-full object-cover transition-transform hover:scale-110" // Efek zoom dikit pas hover
              onError={(e) => {
                // Fallback kalau gambar error/broken
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/100x100?text=No+Image";
              }}
            />
          ) : (
            <ImageIcon className="text-gray-300 w-6 h-6" />
          )}
        </div>
      ),
    },

    {
      header: "Nama Paket",
      className: "align-top",
      render: (item: any) => (
        <div className="flex flex-col gap-1 pt-1">
          {" "}
          {/* Tambah pt-1 biar sejajar sama foto */}
          <span
            className={`font-bold transition-colors ${
              item.isActive ? "text-slate-800" : "text-slate-400"
            }`}
          >
            {item.judul}
          </span>
          {/* Badge Status */}
          {item.isActive ? (
            <span className="w-fit text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
              Aktif
            </span>
          ) : (
            <span className="w-fit text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold border border-slate-200">
              Non-Aktif
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Harga Mulai",
      className: "align-top pt-3", // pt-3 biar vertikal align enak dilihat
      render: (item: any) => {
        let displayPrice = 0;
        if (item.harga) {
          displayPrice = item.harga;
        } else if (item.layanans && item.layanans.length > 0) {
          displayPrice = item.layanans[0].harga;
        }

        return (
          <span
            className={`font-bold px-2 py-1 rounded-md text-xs whitespace-nowrap ${
              item.isActive
                ? "text-slate-700 bg-slate-100"
                : "text-slate-400 bg-slate-50"
            }`}
          >
            {displayPrice > 0 ? formatRupiah(displayPrice) : "Cek Detail"}
          </span>
        );
      },
    },
    {
      header: "Deskripsi",
      className: "min-w-[300px] align-top pt-1",
      render: (item: any) => (
        <div
          className={`text-xs leading-relaxed whitespace-pre-line ${
            item.isActive ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {item.deskripsi || "-"}
        </div>
      ),
    },
    {
      header: "Aksi",
      className: "text-center w-[120px] align-top pt-2",
      render: (item: any) => (
        <div className="flex items-center justify-center gap-2">
          {/* Tombol Edit */}
          <button
            onClick={() => {
              setEditData(item);
              setIsEditModalOpen(true);
            }}
            className="p-1.5 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-md transition bg-white"
            title="Edit Paket"
          >
            <Edit size={14} />
          </button>

          {/* --- [BARU] TOGGLE SWITCH --- */}
          <button
            onClick={() => handleToggleStatus(item)}
            disabled={togglingId === item.id}
            className={`
                relative w-10 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ring-1 ring-inset
                ${
                  item.isActive
                    ? "bg-emerald-500 ring-emerald-600"
                    : "bg-slate-200 ring-slate-300"
                }
                ${
                  togglingId === item.id
                    ? "opacity-50 cursor-wait"
                    : "cursor-pointer"
                }
             `}
            title={item.isActive ? "Matikan Paket" : "Aktifkan Paket"}
          >
            <span
              className={`
                 absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out flex items-center justify-center
                 ${item.isActive ? "translate-x-4" : "translate-x-0"}
               `}
            >
              {togglingId === item.id ? (
                <Loader2 size={10} className="animate-spin text-slate-400" />
              ) : (
                <Power
                  size={10}
                  className={
                    item.isActive ? "text-emerald-500" : "text-slate-300"
                  }
                />
              )}
            </span>
          </button>
        </div>
      ),
    },
  ];

  // Konfigurasi kolom Konsep (sama logikanya)
  // --- COLUMN KONSEP (Updated) ---
  const conceptColumns = [
    {
      header: "No",
      className: "text-center w-[60px] align-top",
      render: (_: any, index: number) => (page - 1) * 5 + index + 1,
    },
    {
      header: "Foto",
      className: "w-[100px] align-top",
      render: (item: any) => (
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
          {item.fotoUrl ? (
            <img
              src={item.fotoUrl}
              alt={item.nama}
              className="w-full h-full object-cover transition-transform hover:scale-110" // Efek zoom dikit pas hover
              onError={(e) => {
                // Fallback kalau gambar error/broken
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/100x100?text=No+Image";
              }}
            />
          ) : (
            <ImageIcon className="text-gray-300 w-6 h-6" />
          )}
        </div>
      ),
    },
    {
      header: "Nama Konsep",
      className: "align-top",
      render: (item: any) => (
        <div className="flex flex-col gap-1 pt-1">
          <span
            className={`font-bold transition-colors ${
              item.isActive ? "text-slate-800" : "text-slate-400"
            }`}
          >
            {item.nama}
          </span>

          {/* Menampilkan Nama Paket Induk (Konsep) */}
          {item.konsep ? (
            <span className="w-fit text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100">
              {item.konsep.judul}
            </span>
          ) : (
            <span className="text-[10px] text-red-400">Tanpa Paket</span>
          )}
        </div>
      ),
    },
    {
      header: "Harga",
      className: "align-top pt-3",
      render: (item: any) => (
        <span
          className={`font-bold px-2 py-1 rounded-md text-xs whitespace-nowrap ${
            item.isActive
              ? "text-slate-700 bg-slate-100"
              : "text-slate-400 bg-slate-50"
          }`}
        >
          {formatRupiah(item.harga)}
        </span>
      ),
    },
    {
      header: "Deskripsi",
      className: "min-w-[250px] align-top pt-1",
      render: (item: any) => (
        <div
          className={`text-xs leading-relaxed whitespace-pre-line ${
            item.isActive ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {item.deskripsi || "-"}
        </div>
      ),
    },
    {
      header: "Aksi",
      className: "text-center w-[120px] align-top pt-2",
      render: (item: any) => (
        <div className="flex items-center justify-center gap-2">
          {/* Tombol Edit */}
          <button
            onClick={() => {
              setEditConceptData(item);
              setIsEditConceptOpen(true);
            }}
            className="p-1.5 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-md transition bg-white"
            title="Edit Paket"
          >
            <Edit size={14} />
          </button>

          {/* --- [BARU] TOGGLE SWITCH --- */}
          <button
            onClick={() => handleToggleStatus(item)}
            disabled={togglingId === item.id}
            className={`
                relative w-10 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ring-1 ring-inset
                ${
                  item.isActive
                    ? "bg-emerald-500 ring-emerald-600"
                    : "bg-slate-200 ring-slate-300"
                }
                ${
                  togglingId === item.id
                    ? "opacity-50 cursor-wait"
                    : "cursor-pointer"
                }
             `}
            title={item.isActive ? "Matikan Paket" : "Aktifkan Paket"}
          >
            <span
              className={`
                 absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out flex items-center justify-center
                 ${item.isActive ? "translate-x-4" : "translate-x-0"}
               `}
            >
              {togglingId === item.id ? (
                <Loader2 size={10} className="animate-spin text-slate-400" />
              ) : (
                <Power
                  size={10}
                  className={
                    item.isActive ? "text-emerald-500" : "text-slate-300"
                  }
                />
              )}
            </span>
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden">
      <DashboardHeader
        title="Service Management"
        subtitle="Kelola paket layanan dan konsep studio"
      />

      <div className="flex-1 bg-[#F0F8FF] px-[20px] md:px-[60px] pb-10">
        <div className="w-full mt-6 bg-white rounded-[24px] p-10 border border-gray-100 shadow-sm min-h-[600px]">
          <BookingTabs
            tabs={tabConfig}
            activeTab={activeTab}
            onChange={(id) => {
              setActiveTab(id);
              setPage(1);
            }}
          />

          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mt-6 mb-4">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Cari ${
                  activeTab === "paket" ? "Paket" : "Konsep"
                }...`}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
              <div className="flex-shrink-0">
                <FilterActions onSortChange={(val) => setSortBy(val)} />
              </div>
              <button
                onClick={handleAddClick} // [FIX] Gunakan handler dinamis
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 shrink-0"
              >
                <Plus size={18} />
                <span>Tambah {activeTab === "paket" ? "Paket" : "Konsep"}</span>
              </button>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
              </div>
            ) : dataList.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-4">
                <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-semibold">Tidak ada data {activeTab}.</p>
              </div>
            ) : (
              <Table
                data={dataList}
                columns={
                  activeTab === "paket" ? packageColumns : conceptColumns
                }
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="w-full mt-6">
            {!isLoading && dataList.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>

      <AddPackageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => loadData()}
      />

      <EditPackageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editData}
        onSuccess={() => loadData()}
      />
      {/* --- [FIX] TAMBAHKAN MODAL KONSEP DISINI --- */}
      <AddConceptModal
        isOpen={isAddConceptOpen}
        onClose={() => setIsAddConceptOpen(false)}
        onSuccess={() => loadData()}
      />
      <EditConceptModal
        isOpen={isEditConceptOpen}
        onClose={() => setIsEditConceptOpen(false)}
        initialData={editConceptData}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
