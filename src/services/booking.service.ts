// src/services/booking.service.ts
import axiosInstance from "@/lib/axios";
import { CreateBookingPayload, BookingResponse } from "@/types/booking";

export const bookingService = {
  // 1. Create Booking
  createBooking: async (
    payload: CreateBookingPayload
  ): Promise<BookingResponse> => {
    // URL sesuaikan dengan Controller NestJS kamu
    const response = await axiosInstance.post("/booking", payload);
    return response.data;
  },

  // 2. Upload Bukti Bayar
  uploadPaymentProof: async (bookingId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      `/booking/${bookingId}/payment-proof`, // Sesuaikan route upload di backend
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
