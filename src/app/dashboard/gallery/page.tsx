"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios"; // <--- INI KUNCINYA (Import library axios project kamu)
import Link from "next/link";
import { getStatusColor, getUploadStats } from "@/lib/galleryHelpers";
import { PageHeaderCard } from "@/components/dashboard/PageHeaderCard";
import FolderCard from "@/components/gallery/FolderCard";
import { useGallery } from "@/hooks/useGallery";

export default function GalleryPage() {
  // --- STATE MANAGEMENT ---
  const { folders, isLoading, error } = useGallery("/folders/my-folders");

  return (
    <div className="flex flex-col items-center w-full">
      {/* --- PERBAIKAN 1: NAIKKAN Z-INDEX JADI z-50 --- */}
      {/* Sebelumnya z-20, sekarang z-50 agar folder (z-20) bisa masuk ke kolong header */}
      <div className="sticky top-[94px] z-50 w-full bg-foundation-primarylight pb-5 pt-2 transition-all">
        <PageHeaderCard
          title="Gallery Bookings"
          subtitle="Gallery hasil pemotretan anda akan tampil disini."
        />
      </div>

      <div className="flex flex-col items-start gap-[20px] p-[20px] md:p-[40px] w-full bg-white rounded-[20px] shadow-sm min-h-[80vh]">
        {/* ... Loading & Error states ... */}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {folders.length > 0 ? (
              folders.map((folder) => {
                const { uploaded, total, isUploading } = getUploadStats(folder);
                const hasImage =
                  Array.isArray(folder.hasilFoto) &&
                  folder.hasilFoto.length > 0;
                const coverImage = hasImage
                  ? folder.hasilFoto[0].path
                  : "/assets/images/folder-empty-placeholder.jpg";

                return (
                  // --- PERBAIKAN 2: HAPUS 'contents', GANTI JADI 'block' ---
                  // 'contents' membuat Link hilang secara visual sehingga merusak layout grid
                  <Link
                    key={folder.id}
                    href={`/dashboard/gallery/${folder.id}`}
                    className="block w-full h-full"
                  >
                    <FolderCard
                      title={folder.nama}
                      date={new Date(folder.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                      imageSrc={coverImage}
                      isUploading={isUploading}
                      uploadedCount={uploaded}
                      totalCount={total}
                      folderColor={getStatusColor(folder.booking?.status)}
                    />
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-400 py-10 font-lato">
                Belum ada folder gallery yang tersedia.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
