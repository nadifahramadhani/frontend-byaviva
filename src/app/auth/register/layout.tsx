import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register", // Judul halaman ini
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}