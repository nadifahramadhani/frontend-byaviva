"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Table } from "@/components/ui/Table"; // Asumsi kamu sudah punya komponen Table reusable dari page sebelumnya
import {
  fetchPortfolios,
  deletePortfolio,
} from "@/services/admin-service.service";
import AddPortfolioModal from "@/components/admin/portfolio/AddPortfolioModal";
import EditPortfolioModal from "@/components/admin/portfolio/EditPortfolioModal";

export default function AdminPortofolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataList, setDataList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Load Data Function
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPortfolios();
      setDataList(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Data
  const filteredData = dataList.filter(
    (item) =>
      item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.klien?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus portofolio ini?")) {
      try {
        await deletePortfolio(id);
        loadData(); // Refresh data
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  // --- DEFINISI KOLOM TABEL ---
  const columns = [
    {
      header: "No",
      className: "text-center w-[60px] align-top",
      render: (_: any, index: number) => index + 1,
    },
    {
      header: "Foto",
      className: "w-[100px] align-top",
      render: (item: any) => (
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
          {item.fotoUrl ? (
            <img
              src={item.fotoUrl}
              alt={item.judul}
              className="w-full h-full object-cover"
              onError={(e) =>
                ((e.target as HTMLImageElement).src =
                  "https://placehold.co/100x100?text=No+Img")
              }
            />
          ) : (
            <ImageIcon className="text-gray-300 w-6 h-6" />
          )}
        </div>
      ),
    },
    {
      header: "Detail Project",
      className: "align-top",
      render: (item: any) => (
        <div className="flex flex-col gap-1 pt-1">
          <span className="font-bold text-slate-800">{item.judul}</span>
          <div className="flex gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
              {item.kategori}
            </span>
            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {item.klien}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Tanggal",
      className: "align-top pt-3 w-[150px]",
      render: (item: any) => (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          {item.tanggal
            ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </div>
      ),
    },
    {
      header: "Aksi",
      className: "text-center w-[120px] align-top pt-2",
      render: (item: any) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(item);
              setIsEditOpen(true);
            }}
            className="p-2 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-lg transition bg-white"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-2 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 rounded-lg transition bg-white"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden">
      <DashboardHeader
        title="Portofolio"
        subtitle="Pantau Semua Karya terbaik kamu disini"
      />

      <div className="flex-1 bg-[#F0F8FF] px-[20px] md:px-[60px] pb-10">
        {/* CARD WRAPPER */}
        <div className="w-full mt-6 bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm min-h-[600px]">
          {/* TOOLBAR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari Project atau Klien..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 shrink-0"
            >
              <Plus size={18} />
              <span>Tambah Project</span>
            </button>
          </div>

          {/* TABEL CONTENT */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">Belum ada data portofolio.</p>
              </div>
            ) : (
              <Table data={filteredData} columns={columns} isLoading={false} />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddPortfolioModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadData}
      />

      <EditPortfolioModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={selectedItem}
        onSuccess={loadData}
      />
    </div>
  );
}
