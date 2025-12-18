// src/types/gallery.ts

export interface Booking {
  bookingNumber: string;
  status: string;
  layanan: { nama: string };
  konsep: { judul: string };
  client?: { clientName: string }; // Tambahan jika admin butuh nama client
}

export interface FolderChild {
  id: number;
  nama: string;
  path: string;
  createdAt: string;
  hasilFoto: any[];
}

export interface FolderData {
  id: number;
  bookingId: number;
  nama: string;
  path: string;
  parentId: number | null;
  createdAt: string;
  booking: Booking | null; // Bisa null jika subfolder
  children: FolderChild[];
  hasilFoto: any[];
}

export interface Photo {
  id: number;
  path: string;
  nama: string;
}

export interface FolderDetail {
  id: number;
  nama: string;
  path: string;
  createdAt: string;
  parentId: number | null;
  // Kita reuse tipe Booking dari yang sudah ada (atau sesuaikan jika perlu detail Client)
  booking: Booking | null;
  children: FolderDetail[]; // Sub-folders
  hasilFoto: Photo[]; // Foto-foto
}
