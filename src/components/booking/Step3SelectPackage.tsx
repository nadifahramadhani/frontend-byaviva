"use client";
import { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { useBooking } from "@/context/BookingContext";

interface Layanan {
  id: number;
  nama: string;
  kode: string;
  harga: number;
  deskripsi: string;
  isActive: boolean;
  konsepId: number;
  fotoUrl?: string; // [FIX] Tambahkan properti fotoUrl
}

interface Konsep {
  id: number;
  judul: string;
  kode: string;
  deskripsi: string;
  fotoUrl: string;
  isActive: boolean;
}

interface GroupedConcept extends Konsep {
  packages: Layanan[];
}

export default function Step3SelectPackage({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { data, updateData } = useBooking();
  const [concepts, setConcepts] = useState<Konsep[]>([]);
  const [packages, setPackages] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper yang diperbaiki untuk handle URL
  const getImageUrl = (url?: string) => {
    if (!url) return "https://via.placeholder.com/600x400?text=No+Image";

    // Jika URL sudah lengkap (http/https), pakai langsung
    if (url.startsWith("http")) return url;

    // Jika path relatif murni (misal: "konsep-123.jpg"), baru tambahkan base URL
    // Hapus slash di depan jika ada agar tidak double
    const cleanPath = url.startsWith("/") ? url.slice(1) : url;

    // Asumsi: jika path tidak ada '/uploads/', tambahkan. Jika sudah ada, jangan.
    // Tapi karena backend Anda sepertinya konsisten, cukup pakai base URL saja jika path relatif
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Cek apakah path sudah mengandung 'uploads'
    if (cleanPath.startsWith("uploads/")) {
      return `${baseUrl}/${cleanPath}`;
    }

    return `${baseUrl}/uploads/${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resPaket, resKonsep] = await Promise.all([
          axiosInstance.get("/layanan"),
          axiosInstance.get("/konsep"),
        ]);
        setPackages(resPaket.data);
        setConcepts(resKonsep.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedConcepts = useMemo<GroupedConcept[]>(() => {
    if (concepts.length === 0 || packages.length === 0) return [];
    const conceptMap = new Map<number, GroupedConcept>();
    concepts.forEach((concept) => {
      conceptMap.set(concept.id, { ...concept, packages: [] });
    });
    packages.forEach((pkg) => {
      const group = conceptMap.get(pkg.konsepId);
      if (group) {
        group.packages.push(pkg);
      }
    });
    return Array.from(conceptMap.values()).filter(
      (group) => group.packages.length > 0
    );
  }, [concepts, packages]);

  const handleSelectPackage = (pkg: Layanan, concept: Konsep) => {
    updateData({
      packageId: pkg.id,
      packagePrice: pkg.harga,
      packageName: pkg.nama,
      packageDescription: pkg.deskripsi,
      conceptId: concept.id,
      conceptPrice: 0,
      conceptName: concept.judul,
      conceptFotoUrl: concept.fotoUrl,
      conceptDescription: concept.deskripsi,
    });
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        <span className="ml-3 text-slate-600">Memuat Paket & Konsep...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800">
          Pilih Paket Berdasarkan Konsep
        </h3>
      </div>

      {groupedConcepts.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          Belum ada Konsep dengan Layanan aktif yang tersedia.
        </p>
      ) : (
        groupedConcepts.map((group) => {
          const isConceptSelected = data.conceptId === group.id;

          return (
            <div key={group.id} className="mb-12 border-b pb-8">
              {/* HEADER KONSEP VISUAL */}
              <div
                className={`flex items-center gap-6 p-4 rounded-xl border mb-6 transition-colors ${
                  isConceptSelected
                    ? "border-slate-800 bg-slate-50"
                    : "border-gray-200"
                }`}
              >
                <div className="h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={getImageUrl(group.fotoUrl)} // [FIX] Gunakan fungsi helper yang sudah diperbaiki
                    alt={group.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/600x400?text=Error";
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {group.judul}
                    {isConceptSelected && (
                      <span className="ml-3 text-sm bg-slate-800 text-white px-3 py-1 rounded-full">
                        KONSEP AKTIF
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm">{group.deskripsi}</p>
                </div>
              </div>

              {/* LIST LAYANAN (PAKET) */}
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.packages.map((pkg) => {
                  const isPackageSelected = data.packageId === pkg.id;

                  if (!pkg.isActive) return null;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg, group)}
                      className={`
                        cursor-pointer rounded-xl border-2 p-5 transition-all relative flex flex-col justify-between
                        ${
                          isPackageSelected
                            ? "border-orange-500 bg-orange-50 shadow-lg transform scale-105"
                            : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                        }
                      `}
                    >
                      {isPackageSelected && (
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">
                          DIPILIH
                        </div>
                      )}

                      {/* [TAMBAHAN] Foto Paket (Opsional jika ingin ditampilkan) */}
                      {pkg.fotoUrl && (
                        <div className="h-32 w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(pkg.fotoUrl)}
                            alt={pkg.nama}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-lg text-slate-800 mb-1">
                          {pkg.nama}
                        </h4>
                        <p className="text-orange-600 font-bold text-xl mb-3">
                          {formatRupiah(pkg.harga)}
                        </p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                          {pkg.deskripsi}
                        </p>
                      </div>
                      <button
                        className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                          isPackageSelected
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isPackageSelected ? "Terpilih" : "Pilih Paket"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
