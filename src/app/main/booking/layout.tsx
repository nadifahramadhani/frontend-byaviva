import AuthGuard from "@/components/auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking - By Aviva",
  description: "Halaman pemesanan foto",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Bungkus children dengan AuthGuard
    <AuthGuard>{children}</AuthGuard>
  );
}
