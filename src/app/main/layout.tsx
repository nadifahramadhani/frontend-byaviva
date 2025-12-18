import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar /> {/* Navbar hanya muncul di sini */}
      {/* Pindahkan padding top ke sini agar konten tidak tertutup navbar */}
      <div className="pt-[94px]">{children}</div>
      {/* Footer juga bisa ditaruh di sini */}
    </>
  );
}
