import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login", // Judul halaman ini
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
