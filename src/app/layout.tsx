import type { Metadata } from "next";
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
      {/* Hapus class pt-[94px] dan Navbar dari sini */}
      <body>{children}</body>
    </html>
  );
}
