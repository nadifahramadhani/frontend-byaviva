// src/utils/galleryHelpers.ts
import { FolderData } from "@/types/gallery";

export const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case "canceled":
      return "#772020";
    case "rejected":
      return "#772020";
    case "completed":
      return "#19778D";
    case "pending":
      return "#CC9202";
    default:
      return "#335C67"; // Default / Approved
  }
};

export const getUploadStats = (folder: FolderData) => {
  const uploaded = Array.isArray(folder.hasilFoto)
    ? folder.hasilFoto.length
    : 0;
  const total = 100; // Nanti bisa diganti logic dinamis

  // Logic: Sedang upload jika status BUKAN canceled/rejected DAN foto belum full
  const statusBooking = folder.booking?.status;
  const isUploading =
    statusBooking !== "canceled" &&
    statusBooking !== "rejected" &&
    uploaded < total;

  return { uploaded, total, isUploading };
};
