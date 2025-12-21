// --- TIPE UMUM (REUSABLE) ---
export interface LayananType {
  id: number;
  nama: string;
  harga: number;
  deskripsi?: string;
  konsepId?: number; // Tambahan opsional sesuai respon API
}

export interface KonsepType {
  id: number;
  judul: string;
  harga: number;
  deskripsi?: string;
  image?: string;
}

// --- TIPE UNTUK FORM CLIENT (YANG LAMA TETAP ADA) ---
export interface BookingState {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lokasi: string;
  shootDate: Date | null;
  shootTime: string;
  discussion1Date: Date | null;
  discussion1Time: string;
  discussion2Date: Date | null;
  discussion2Time: string;
  selectedLayanan: LayananType | null;
  selectedKonsep: KonsepType | null;
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

// --- [BARU] TIPE KHUSUS UNTUK DATA TABLE ADMIN ---
// Sesuai dengan JSON response dari: http://localhost:3000/api/booking/admin/all
export interface BookingAdminItem {
  id: number;
  userId: number;
  layananId: number;
  konsepId: number;
  bookingNumber: string;
  status: string; // 'waiting_payment' | 'dp_paid' | 'canceled' | etc
  createdAt: string;

  // Relasi (Nested Objects)
  layanan: {
    id: number;
    nama: string;
    harga: number;
    deskripsi: string;
    isActive: boolean;
    konsepId: number;
  };

  client: {
    id: number;
    bookingId: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
  };

  schedule: {
    id: number;
    bookingId: number;
    tanggalBooking: string; // ISO String format
    startTime: string;
    endTime: string;
  };

  pembayaran: {
    id: number;
    tipe: string;
    jumlah: number;
    status: string;
    buktiBayarUrl: string;
    paidAt: string | null;
  }[];

  lokasi?: {
    id: number;
    lokasi: string;
  } | null;
}
