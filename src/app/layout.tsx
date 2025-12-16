import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Byaviva Studio",
    default: "Byaviva Studio",
  },
  description: "Aplikasi pemesanan dan galeri foto Byaviva Studio",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="pt-[94px]">
        <Navbar /> {/* Navbar diletakkan di sini */}
        {children}
        {/* Opsional: Footer diletakkan di sini */}
      </body>
    </html>
  );
}
