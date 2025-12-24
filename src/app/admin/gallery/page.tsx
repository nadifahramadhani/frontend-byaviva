"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Image as ImageIcon,
  Plus,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { fetchGalleryFolders } from "@/services/admin-service.service";
import FolderCard from "@/components/gallery/FolderCard";
import { FilterActions } from "@/components/admin/FilterActions";
import CreateFolderModal from "@/components/admin/gallery/CreateFolderModal"; // [IMPORT]

// --- HELPER: Grouping Logic ---
const getWeekGroup = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // Reset time to 00:00 for accurate comparison
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return "Minggu Ini";
  if (diffDays < 14) return "Minggu Lalu";
  if (diffDays < 30) return "Bulan Ini";
  if (diffDays < 60) return "Bulan Lalu";
  return "Lebih Lama";
};

// Priority Order for Groups
const GROUP_ORDER = [
  "Minggu Ini",
  "Minggu Lalu",
  "Bulan Ini",
  "Bulan Lalu",
  "Lebih Lama",
];

// --- [NEW] Group Styling Configuration ---
// Mengambil warna dari Palette "Summer x Dark" & "Primary"
const GROUP_STYLES: Record<
  string,
  { text: string; border: string; bg: string }
> = {
  "Minggu Ini": {
    text: "text-[#219EBC]", // Primary Normal (Blue)
    border: "bg-[#219EBC]",
    bg: "bg-[#219EBC]/10", // Background tipis
  },
  "Minggu Lalu": {
    text: "text-[#335C67]", // Summer Dark Teal
    border: "bg-[#335C67]",
    bg: "bg-[#335C67]/10",
  },
  "Bulan Ini": {
    text: "text-[#E09F3E]", // Summer Orange/Sand
    border: "bg-[#E09F3E]",
    bg: "bg-[#E09F3E]/10",
  },
  "Bulan Lalu": {
    text: "text-[#9E2A2B]", // Summer Terracotta
    border: "bg-[#9E2A2B]",
    bg: "bg-[#9E2A2B]/10",
  },
  "Lebih Lama": {
    text: "text-[#023047]", // Summer Dark Blue
    border: "bg-[#023047]",
    bg: "bg-[#023047]/10",
  },
};

export default function AdminGalleryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE FILTER & SEARCH ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterPackage, setFilterPackage] = useState("all");

  // Data State
  const [folders, setFolders] = useState<any[]>([]);
  const [groupedFolders, setGroupedFolders] = useState<Record<string, any[]>>(
    {}
  );

  // Palette untuk Folder Card (Seragam: Primary Darker)
  const folderCardColor = "#0C3742";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // [FUNCTION] Refresh data setelah create sukses
  const handleSuccessCreate = () => {
    // Panggil ulang loadData() atau fetch ulang
    // Cara gampang: set state trigger atau panggil fungsi fetch
    // Di sini saya asumsikan kode fetch ada di dalam useEffect,
    // jadi kita bisa bikin fungsi terpisah 'fetchData' di luar useEffect dan memanggilnya.
    window.location.reload(); // Paling simpel reload, atau refetch state.
  };

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGalleryFolders();

        if (data && data.length > 0) {
          const transformedData = data.map((item: any) => {
            const nameParts = item.nama.split(" - ");
            const clientName = nameParts.length > 1 ? nameParts[1] : item.nama;

            let totalPhotos = item.hasilFoto?.length || 0;
            if (item.children) {
              item.children.forEach((child: any) => {
                if (child.hasilFoto) totalPhotos += child.hasilFoto.length;
              });
            }

            return {
              id: item.id,
              clientName: clientName,
              bookingNumber: item.booking?.bookingNumber,
              bookingDate: item.createdAt,
              photoCount: totalPhotos,
              totalCount: 100,
              isUploading: item.booking?.status !== "completed",
              folderColor: folderCardColor, // Warna Seragam
              packageName: "Wedding",
            };
          });

          setFolders(transformedData);
        } else {
          setFolders([]);
        }
      } catch (error) {
        console.error("Gagal load folder:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- LOGIC FILTER, SORT & GROUPING ---
  useEffect(() => {
    let result = [...folders];

    // 1. Search Logic
    if (searchQuery) {
      result = result.filter(
        (f) =>
          f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Package Filter Logic
    if (filterPackage !== "all") {
      result = result.filter(
        (f) => f.packageName?.toLowerCase() === filterPackage.toLowerCase()
      );
    }

    // 3. Sorting Logic
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
    } else if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
      );
    } else if (sortBy === "price_high") {
      result.sort((a, b) => b.photoCount - a.photoCount);
    } else if (sortBy === "price_low") {
      result.sort((a, b) => a.photoCount - b.photoCount);
    }

    // 4. GROUPING LOGIC
    const groups: Record<string, any[]> = {};
    GROUP_ORDER.forEach((key) => (groups[key] = []));

    result.forEach((folder) => {
      const groupName = getWeekGroup(folder.bookingDate);
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(folder);
    });

    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });

    setGroupedFolders(groups);
  }, [searchQuery, filterPackage, sortBy, folders]);

  const handleFolderClick = (folderId: number) => {
    router.push(`/admin/gallery/${folderId}`);
  };

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden bg-[#F0F8FF]">
      <DashboardHeader
        title="Gallery"
        subtitle="Pantau gallery setiap client kamu disini"
      />

      <div className="flex-1 px-[30px] md:px-[60px] pb-10 flex flex-col gap-6">
        {/* 1. UPLOAD PROGRESS SECTION */}
        {/* <div className="w-full bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 text-lg">Upload Progress</h3>
          </div>
          <div className="flex flex-col gap-4">
            {folders.slice(0, 2).map((folder) => (
              <div key={folder.id} className="w-full">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{folder.clientName}</span> */}
        {/* Menggunakan warna aksen biru cerah untuk status progress */}
        {/* <span className="text-[#219EBC]">
                    {folder.isUploading ? "Uploading..." : "Completed"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full w-[85%] bg-[#219EBC]" // Warna Primary Normal
                    style={{ width: folder.isUploading ? "60%" : "100%" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* 2. TOOLBAR */}
        <div className="w-full bg-white rounded-[20px] px-6 py-4 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-xl text-slate-800">Client Folder</h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Client or ID..."
                className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#219EBC] w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
              <FilterActions
                onPackageChange={(val) => setFilterPackage(val)}
                packageOptions={[
                  { label: "Wedding", value: "Wedding" },
                  { label: "Prewedding", value: "Prewedding" },
                  { label: "After Dusk", value: "After Dusk" },
                  { label: "Stroll With You", value: "Stroll With You" },
                ]}
                onSortChange={(val) => setSortBy(val)}
              />
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 shrink-0"
              >
                <Plus size={18} />
                <span>Tambah Folder</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. FOLDER GRID (GROUPED) */}
        <div className="w-full bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col gap-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <Loader2 className="animate-spin w-8 h-8 mb-3 text-slate-300" />
              <p className="text-sm font-medium">Memuat data...</p>
            </div>
          ) : Object.keys(groupedFolders).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ImageIcon className="w-6 h-6 text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">Belum ada folder</p>
              <p className="text-xs text-slate-400 mt-1">
                Folder baru akan muncul di sini
              </p>
            </div>
          ) : (
            // --- LOOPING SETIAP GRUP ---
            <div className="flex flex-col gap-12">
              {GROUP_ORDER.map((groupName) => {
                const foldersInGroup = groupedFolders[groupName];
                if (!foldersInGroup || foldersInGroup.length === 0) return null;

                const textColor = GROUP_STYLES[groupName] || "text-slate-500";

                return (
                  <div key={groupName} className="flex flex-col gap-5">
                    {/* HEADER GRUP - Minimalist Modern */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 font-bold text-sm uppercase tracking-wider ${textColor}`}
                      >
                        <Calendar size={14} className="mb-0.5" />
                        {groupName}
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                    </div>

                    {/* GRID ITEM */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {foldersInGroup.map((folder) => (
                        <div
                          key={folder.id}
                          onClick={() => handleFolderClick(folder.id)}
                          className="transform transition-all duration-300 hover:-translate-y-1" // Animasi halus di wrapper
                        >
                          <FolderCard
                            title={folder.clientName}
                            date={new Date(
                              folder.bookingDate
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long", // Format bulan panjang agar lebih elegan
                              year: "numeric",
                            })}
                            isUploading={folder.isUploading}
                            uploadedCount={folder.photoCount}
                            totalCount={folder.totalCount}
                            folderColor={folder.folderColor}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* [COMPONENT] Pasang Modal Disini (Sebelum tutup div utama) */}
      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccessCreate}
      />
    </div>
  );
}
