import { DashboardHeader } from "@/components/admin/DashboardHeader";

export default function AdminPortofolioPage() {
  return (
    // Kita langsung mulai dari container konten, karena wrapper utama ada di layout
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden">
      {/* HEADER */}
      <DashboardHeader
        title="Portofolio"
        subtitle="Pantau Semua Karya terbaik kamu disini"
      />

      {/* CONTENT AREA */}
      <div className="flex-1 bg-[#F0F8FF] px-[40px] md:px-[60px] pb-10">
        {/* Placeholder Tabel */}
        <div className="w-full mt-6 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400">
          <p>Tabel Portofolio akan ditampilkan di sini.</p>
        </div>
      </div>
    </div>
  );
}
