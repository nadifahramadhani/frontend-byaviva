"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import {
  BookingState,
  LayananType,
  KonsepType,
  BookingResponse,
} from "@/types/booking";

// Default value yang diperbarui
const defaultState: BookingState = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  lokasi: "",

  shootDate: null,
  shootTime: "",
  discussion1Date: null,
  discussion1Time: "",
  discussion2Date: null,
  discussion2Time: "", // Opsional kosong dulu

  selectedLayanan: null,
  selectedKonsep: null,
  createdBooking: null,
};

const BookingContext = createContext<any>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BookingState>(defaultState);

  const updateData = (newData: Partial<BookingState>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const estimatedTotal =
    (data.selectedLayanan?.harga || 0) + (data.selectedKonsep?.harga || 0);

  return (
    <BookingContext.Provider value={{ data, updateData, estimatedTotal }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
