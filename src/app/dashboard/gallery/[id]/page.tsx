"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// [1. IMPORT DOWNLOAD ICON]
import { ArrowLeft, ImageOff, Download } from "lucide-react";

import { useFolderDetail } from "@/hooks/useGallery";
import { getStatusColor } from "@/lib/galleryHelpers";
import { PageHeaderCard } from "@/components/dashboard/PageHeaderCard";
import FolderCard from "@/components/gallery/FolderCard";

// Helper validasi URL
const getValidImageUrl = (url: string | null | undefined) => {
  if (!url || url.trim() === "") return null;
  return url;
};

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id as string;

  const { folder, isLoading, error } = useFolderDetail(folderId);

  // [2. FUNGSI DOWNLOAD (Copy dari Admin)]
  const handleDownloadPhoto = async (url: string, filename: string) => {
    try {
      // Fetch gambar sebagai Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Buat URL sementara
      const blobUrl = window.URL.createObjectURL(blob);

      // Buat elemen anchor <a> palsu
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "download-image.jpg";
      document.body.appendChild(link);
      link.click();

      // Bersihkan memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Gagal download:", err);
      alert("Gagal mendownload gambar. Coba lagi.");
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Memuat...
      </div>
    );
  if (error || !folder)
    return (
      <div className="p-10 text-center text-red-500">
        {error || "Folder tidak ditemukan"}
      </div>
    );

  const currentStatus = folder.booking?.status || "completed";
  const themeColor = getStatusColor(currentStatus);

  return (
    <div className="flex flex-col items-center w-full">
      {/* HEADER */}
      <div className="sticky top-[94px] z-50 w-full bg-foundation-primarylight pb-5 pt-2 transition-all">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors w-fit px-4 font-semibold text-sm"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
          <PageHeaderCard
            title={folder.nama}
            subtitle={
              folder.booking
                ? `Client: ${
                    folder.booking.client?.clientName || "-"
                  } | Booking: ${folder.booking.bookingNumber}`
                : "Sub-folder Gallery"
            }
          />
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex flex-col items-start gap-[30px] p-[20px] md:p-[40px] w-full bg-white rounded-[20px] shadow-sm min-h-[80vh]">
        {/* === A: SUB-FOLDERS === */}
        {folder.children && folder.children.length > 0 && (
          <div className="w-full">
            <h3 className="text-lg font-bold text-gray-700 mb-4 font-montserrat">
              Folders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {folder.children.map((child: any) => {
                let folderImage = null;
                if (child.hasilFoto?.length > 0) {
                  folderImage =
                    child.hasilFoto[0].fileUrl || child.hasilFoto[0].path;
                }

                return (
                  <Link
                    key={child.id}
                    href={`/dashboard/gallery/${child.id}`}
                    className="block w-full h-full"
                  >
                    <FolderCard
                      title={child.nama}
                      date={new Date(child.createdAt).toLocaleDateString(
                        "id-ID"
                      )}
                      imageSrc={folderImage}
                      isUploading={false}
                      uploadedCount={child.hasilFoto?.length || 0}
                      totalCount={0}
                      folderColor={themeColor}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* === B: FOTO-FOTO === */}
        {folder.hasilFoto && folder.hasilFoto.length > 0 ? (
          <div className="w-full mt-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4 font-montserrat">
              Photos ({folder.hasilFoto.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {folder.hasilFoto.map((foto: any) => {
                // Pastikan pakai fileUrl
                const rawUrl = foto.fileUrl || foto.path;
                const validSrc = getValidImageUrl(rawUrl);

                // Siapkan nama file untuk download
                const fileName = foto.deskripsi || `photo-${foto.id}.jpg`;

                return (
                  <div
                    key={foto.id}
                    className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 border hover:shadow-lg transition-all cursor-pointer"
                  >
                    {validSrc ? (
                      <img
                        src={validSrc}
                        alt={foto.nama || "Gallery Photo"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Pastikan file placeholder ini ADA di public/assets/images/
                          target.src = "/assets/images/placeholder-image.jpg";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-300 flex-col gap-2">
                        <ImageOff size={24} />
                        <span className="text-[10px]">No Image</span>
                      </div>
                    )}

                    {/* [3. UI OVERLAY DOWNLOAD] */}
                    {/* Overlay Gradient (Efek Gelap di bawah) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Tombol Download */}
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah klik tembus ke div foto
                            if (validSrc)
                              handleDownloadPhoto(validSrc, fileName);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-md rounded-lg hover:bg-white text-slate-700 hover:text-[#219EBC] shadow-lg transition-colors"
                          title="Download"
                        >
                          <Download size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          folder.children.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p>Folder ini kosong.</p>
              <span className="text-xs">Belum ada foto yang diupload.</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
