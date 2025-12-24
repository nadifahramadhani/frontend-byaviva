"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Folder as FolderIcon,
  Image as ImageIcon,
  Loader2,
  Download,
  ChevronRight,
  Plus,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import {
  fetchFolderDetail,
  deleteGalleryPhoto, // [IMPORT BARU]
} from "@/services/admin-service.service";
import FolderCard from "@/components/gallery/FolderCard";
import CreateFolderModal from "@/components/admin/gallery/CreateFolderModal";
import UploadPhotoModal from "@/components/admin/gallery/UploadPhotoModal";

// --- HOOK: Fetch Detail (TETAP SAMA) ---
const useFolderDetail = (id: number) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFolderDetail(id);
        if (res) setData(res);
        else setError("Folder tidak ditemukan");
      } catch (err) {
        setError("Gagal memuat folder");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  return { folder: data, isLoading, error };
};

export default function AdminGalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = Number(params.id);

  const { folder, isLoading, error } = useFolderDetail(folderId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // State untuk loading saat menghapus (biar user gak spam klik)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  // --- HANDLERS NAVIGATION (TETAP SAMA) ---
  const handleBack = () => {
    if (folder?.parentId) router.push(`/admin/gallery/${folder.parentId}`);
    else router.push("/admin/gallery");
  };
  const handleSubFolderClick = (subId: number) =>
    router.push(`/admin/gallery/${subId}`);
  const handleSuccessCreate = () => window.location.reload();
  const handleSuccessUpload = () => window.location.reload();

  // --- [FITUR BARU] DOWNLOAD FOTO ---
  const handleDownloadPhoto = async (url: string, filename: string) => {
    try {
      // Fetch gambar sebagai Blob (Binary Large Object)
      const response = await fetch(url);
      const blob = await response.blob();

      // Buat URL sementara
      const blobUrl = window.URL.createObjectURL(blob);

      // Buat elemen anchor <a> palsu untuk trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "download-image.jpg"; // Nama file saat didownload
      document.body.appendChild(link);
      link.click();

      // Bersihkan
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Gagal download:", err);
      alert("Gagal mendownload gambar. Coba lagi.");
    }
  };

  // --- [FITUR BARU] DELETE FOTO ---
  const handleDeletePhoto = async (photoId: number) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus foto ini secara permanen?"
    );
    if (!confirmDelete) return;

    setIsDeletingId(photoId);
    try {
      await deleteGalleryPhoto(photoId);
      // Reload halaman untuk refresh data
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus foto.");
      setIsDeletingId(null);
    }
  };

  // --- RENDER LOADING / ERROR (TETAP SAMA) ---
  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error || !folder)
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen">
        <p>{error}</p>
      </div>
    );

  const isRoot = !folder.parentId;
  const subFolders = folder.children || [];
  const photos = folder.hasilFoto || [];
  const isEmpty = subFolders.length === 0 && photos.length === 0;
  const FOLDER_COLOR = "#0C3742";

  return (
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden bg-[#F0F8FF] min-h-screen">
      <DashboardHeader
        title="Detail Gallery"
        subtitle="Lihat isi folder dan kelola foto klien"
      />

      <div className="flex-1 px-[30px] md:px-[60px] pb-10 flex flex-col gap-6">
        {/* TOOLBAR (TETAP SAMA) */}
        <div className="w-full bg-white rounded-[20px] px-6 py-4 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-20">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={handleBack}
              className="p-2 bg-white border rounded-xl"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold max-w-[200px]">{folder.nama}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-white border rounded-xl font-bold text-sm flex gap-2 items-center"
            >
              <Plus size={16} /> Folder Baru
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm flex gap-2 items-center"
            >
              <UploadCloud size={16} /> Upload Foto
            </button>
          </div>
        </div>

        {/* SUB-FOLDERS GRID (TETAP SAMA) */}
        {subFolders.length > 0 && (
          <div className="w-full bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-slate-500 mb-4 flex gap-2 items-center">
              <FolderIcon size={16} /> Sub-Folders ({subFolders.length})
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {subFolders.map((sub: any) => (
                <div key={sub.id} onClick={() => handleSubFolderClick(sub.id)}>
                  <FolderCard
                    title={sub.nama}
                    uploadedCount={sub.hasilFoto?.length || 0}
                    date={new Date().toLocaleDateString()}
                    totalCount={0}
                    isUploading={false}
                    folderColor={FOLDER_COLOR}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHOTOS GRID */}
        {photos.length > 0 ? (
          <div className="w-full bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={16} /> Photos ({photos.length})
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {photos.map((photo: any) => {
                // Karena data di DB sudah URL lengkap, langsung pakai saja
                const imageUrl = photo.fileUrl;
                const fileName = photo.deskripsi || `photo-${photo.id}.jpg`;

                return (
                  <div
                    key={photo.id}
                    className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <img
                      src={imageUrl}
                      alt={photo.nama || "Gallery Photo"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Overlay Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="flex justify-end gap-2">
                        {/* TOMBOL DOWNLOAD */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Biar gak trigger klik parent div (kalau ada)
                            handleDownloadPhoto(imageUrl, fileName);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-md rounded-lg hover:bg-white text-slate-700 hover:text-[#219EBC] shadow-lg transition-colors"
                          title="Download"
                        >
                          <Download size={14} strokeWidth={2.5} />
                        </button>

                        {/* TOMBOL DELETE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          disabled={isDeletingId === photo.id}
                          className="p-2 bg-white/90 backdrop-blur-md rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-500 shadow-lg transition-colors disabled:opacity-50"
                          title="Hapus"
                        >
                          {isDeletingId === photo.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          isEmpty && (
            // ... (Empty State Tetap Sama)
            <div className="w-full bg-white rounded-[20px] p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <UploadCloud className="w-10 h-10 text-slate-300 mb-4" />
              <p className="text-slate-400">Folder Kosong</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 border rounded-xl text-sm font-bold"
                >
                  Buat Folder
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold"
                >
                  Upload Foto
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccessCreate}
        isSubFolder={true}
        parentId={folderId}
      />

      {folder && (
        <UploadPhotoModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleSuccessUpload}
          folderId={folderId}
          folderName={folder.nama}
        />
      )}
    </div>
  );
}
