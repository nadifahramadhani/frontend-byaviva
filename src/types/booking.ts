// src/types/booking.ts

export interface LayananType {
  id: number;
  nama: string;
  harga: number;
  deskripsi?: string;
}

export interface KonsepType {
  id: number;
  judul: string;
  harga: number;
  deskripsi?: string;
  image?: string;
}

// Update State agar menampung 3 jadwal
export interface BookingState {
  // Data Diri
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lokasi: string;

  // Jadwal 1: Shoot (Utama)
  shootDate: Date | null;
  shootTime: string;

  // Jadwal 2: Diskusi Awal
  discussion1Date: Date | null;
  discussion1Time: string;

  // Jadwal 3: Diskusi Lanjutan (Opsional)
  discussion2Date: Date | null;
  discussion2Time: string;

  // Data Produk
  selectedLayanan: LayananType | null;
  selectedKonsep: KonsepType | null;

  // Response Backend
  createdBooking: BookingResponse | null;
}

export interface BookingResponse {
  id: number;
  bookingNumber: string;
  status: string;
  pricing: {
    totalAmount: number;
    subtotal: number;
    discount: number;
  };
}
