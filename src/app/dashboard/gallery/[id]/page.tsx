"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// --- IMPORTS DARI REFACTORING ---
import { useFolderDetail } from "@/hooks/useGallery"; // Hook baru
import { getStatusColor } from "@/lib/galleryHelpers"; // Helper baru
// Components
import { PageHeaderCard } from "@/components/dashboard/PageHeaderCard";
import FolderCard from "@/components/gallery/FolderCard";

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id as string; // Pastikan tipe string

  // 1. PANGGIL HOOK (Pengganti useEffect & useState yang panjang tadi)
  const { folder, isLoading, error } = useFolderDetail(folderId);

  // --- LOGIC UI (Loading / Error) ---
  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse font-lato">
        Memuat isi folder...
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 mb-4">
          {error || "Folder tidak ditemukan"}
        </div>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          &larr; Kembali ke Gallery
        </button>
      </div>
    );
  }

  // Logic Warna (Gunakan Helper)
  const currentStatus = folder.booking?.status || "completed";
  const themeColor = getStatusColor(currentStatus);

  return (
    <div className="flex flex-col items-center w-full">
      {/* HEADER (Z-Index 50 agar tidak tertumpuk) */}
      <div className="sticky top-[94px] z-50 w-full bg-foundation-primarylight pb-5 pt-2 transition-all">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors w-fit px-4 font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>

          <PageHeaderCard
            title={folder.nama}
            // Optional chaining (?.) aman digunakan disini karena types sudah didefinisikan
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
              {folder.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/dashboard/gallery/${child.id}`}
                  className="block w-full h-full"
                >
                  <FolderCard
                    title={child.nama}
                    date={new Date(child.createdAt).toLocaleDateString("id-ID")}
                    imageSrc={
                      child.hasilFoto?.length > 0
                        ? child.hasilFoto[0].path
                        : "/assets/images/folder-empty-placeholder.jpg"
                    }
                    isUploading={false}
                    uploadedCount={child.hasilFoto?.length || 0}
                    totalCount={0}
                    folderColor={themeColor} // Warna mewarisi parent
                  />
                </Link>
              ))}
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
              {folder.hasilFoto.map((foto) => (
                <div
                  key={foto.id}
                  className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 border hover:shadow-lg transition-all cursor-pointer"
                >
                  <Image
                    src={foto.path}
                    alt={foto.nama || "Gallery Photo"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
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
