import { DashboardHeader } from "@/components/admin/DashboardHeader";

export default function AdminDashboardPage() {
  return (
    // Kita langsung mulai dari container konten, karena wrapper utama ada di layout
    <div className="flex-1 flex flex-col rounded-tl-[40px] overflow-hidden">
      {/* HEADER */}
      <DashboardHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas studio Anda hari ini"
      />

      {/* CONTENT AREA */}
      <div className="flex-1 bg-[#F0F8FF] px-[40px] md:px-[60px] pb-10">
        {/* --- KONTEN DASHBOARD --- */}
        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contoh Card Dummy */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">Total Booking</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">124</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">Pendapatan Bulan Ini</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">Rp 45jt</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">Pending Approval</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">5</p>
          </div>
        </div>

        {/* Placeholder Tabel */}
        <div className="w-full mt-6 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400">
          <p>Grafik atau Tabel Dashboard akan ditampilkan di sini.</p>
        </div>
      </div>
    </div>
  );
}
