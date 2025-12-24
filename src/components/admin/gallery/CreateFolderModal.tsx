"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  FolderPlus,
  AlertCircle,
  ChevronDown,
  Check,
  Search,
  Folder,
} from "lucide-react";
import {
  createFolderManual,
  fetchBookingsList,
  createSubFolder,
} from "@/services/admin-service.service"; // [NEW IMPORT]

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  parentId?: number | null; // [NEW] ID folder bapaknya (jika subfolder)
  isSubFolder?: boolean; // [NEW] Mode subfolder?
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  onSuccess,
  parentId = null,
  isSubFolder = false,
}: CreateFolderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // State untuk Root Folder (Booking)
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // State untuk Sub Folder (Nama Manual)
  const [folderName, setFolderName] = useState("");

  const [error, setError] = useState("");

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setIsDropdownOpen(false);

      if (isSubFolder) {
        // Mode Subfolder: Reset input nama
        setFolderName("");
      } else {
        // Mode Root: Fetch Booking
        const loadBookings = async () => {
          setIsFetching(true);
          try {
            const data = await fetchBookingsList();
            if (Array.isArray(data)) setBookings(data);
            else if (data?.data && Array.isArray(data.data))
              setBookings(data.data);
            else setBookings([]);
          } catch (err) {
            console.error(err);
            setBookings([]);
          } finally {
            setIsFetching(false);
          }
        };
        loadBookings();
        setSelectedBooking(null);
        setSearchQuery("");
      }
    }
  }, [isOpen, isSubFolder]);

  // ... (Logic Click Outside & Filter Bookings TETAP SAMA) ...
  // (Copy paste logic dropdown sebelumnya di sini jika perlu, tapi fokus kita di handleSubmit)

  // Filter Logic (Untuk mode Root)
  const filteredBookings = bookings.filter((b) => {
    const clientName = b.client?.clientName || b.user?.name || "Tanpa Nama";
    const bookingNum = b.bookingNumber || "";
    const searchLower = searchQuery.toLowerCase();
    return (
      clientName.toLowerCase().includes(searchLower) ||
      bookingNum.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSubFolder) {
        // LOGIC 1: Buat Sub Folder
        if (!folderName.trim())
          throw new Error("Nama folder tidak boleh kosong.");
        if (!parentId) throw new Error("Parent Folder ID hilang.");

        await createSubFolder(parentId, folderName);
      } else {
        // LOGIC 2: Buat Root Folder (Booking)
        if (!selectedBooking)
          throw new Error("Harap pilih booking terlebih dahulu.");
        await createFolderManual(selectedBooking.id);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Gagal membuat folder."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0C3742]/10 rounded-xl flex items-center justify-center text-[#0C3742] shrink-0">
              {isSubFolder ? <Folder size={20} /> : <FolderPlus size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">
                {isSubFolder ? "Buat Sub-Folder Baru" : "Buat Folder Manual"}
              </h3>
              <p className="text-xs text-slate-500">
                {isSubFolder
                  ? "Tambahkan folder baru di dalam sini"
                  : "Generate folder untuk booking tertentu"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Info Alert (Beda pesan tergantung mode) */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
              <AlertCircle
                size={18}
                className="text-blue-600 mt-0.5 shrink-0"
              />
              <div className="text-xs text-blue-700 leading-relaxed">
                {isSubFolder ? (
                  <span>
                    Anda sedang membuat folder baru di dalam direktori ini.
                    Pastikan nama folder unik.
                  </span>
                ) : (
                  <span>
                    <span className="font-bold">Otomatisasi:</span> Sistem akan
                    otomatis membuat nama folder sesuai format{" "}
                    <b>[No.Booking] - [Nama Client]</b>.
                  </span>
                )}
              </div>
            </div>

            {/* === KONDISIONAL FORM === */}
            {isSubFolder ? (
              // FORM INPUT TEXT (SUB FOLDER)
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Nama Folder <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Contoh: Dokumentasi Akad"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#0C3742] focus:ring-2 focus:ring-[#0C3742]/20 transition-all placeholder:font-normal"
                  autoFocus
                />
              </div>
            ) : (
              // FORM DROPDOWN SELECT (ROOT FOLDER)
              <div className="space-y-2 w-full" ref={dropdownRef}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Pilih Booking <span className="text-red-500">*</span>
                </label>

                {/* Trigger Button */}
                <div
                  onClick={() =>
                    !isFetching && setIsDropdownOpen(!isDropdownOpen)
                  }
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer transition-all hover:bg-white ${
                    isDropdownOpen
                      ? "border-[#0C3742] ring-2 ring-[#0C3742]/20 bg-white"
                      : "border-slate-200"
                  }`}
                >
                  <span
                    className={`truncate mr-2 ${
                      selectedBooking ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {selectedBooking
                      ? `${selectedBooking.bookingNumber} - ${
                          selectedBooking.client?.clientName || "Tanpa Nama"
                        }`
                      : isFetching
                      ? "Memuat data..."
                      : "-- Cari Nama Client / No Booking --"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown List */}
                {isDropdownOpen && (
                  <div className="relative w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-inner z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          placeholder="Ketik nama client..."
                          className="w-full pl-9 pr-3 py-2.5 text-sm font-medium border border-slate-200 rounded-lg outline-none focus:border-[#0C3742] focus:ring-1 focus:ring-[#0C3742] bg-white transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* List Items */}
                    <div className="max-h-[220px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <div
                            key={booking.id}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDropdownOpen(false);
                              setSearchQuery("");
                            }}
                            className={`px-3 py-3 rounded-lg cursor-pointer text-sm flex items-center justify-between group transition-all ${
                              selectedBooking?.id === booking.id
                                ? "bg-[#0C3742]/5 text-[#0C3742] font-bold border border-[#0C3742]/10"
                                : "text-slate-600 hover:bg-slate-50 border border-transparent"
                            }`}
                          >
                            <div className="flex flex-col truncate mr-2">
                              <span className="truncate text-slate-800 group-hover:text-[#0C3742] transition-colors">
                                {booking.client?.clientName || "Tanpa Nama"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {booking.bookingNumber}
                              </span>
                            </div>
                            {selectedBooking?.id === booking.id && (
                              <Check
                                size={16}
                                className="text-[#0C3742] shrink-0"
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
                          <Search size={24} className="opacity-20 mb-2" />
                          <span className="text-xs">Data tidak ditemukan</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-3 mt-2 pt-4 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98]"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  isFetching ||
                  (!isSubFolder && !selectedBooking) ||
                  (isSubFolder && !folderName)
                }
                style={{
                  backgroundColor:
                    isLoading ||
                    isFetching ||
                    (!isSubFolder && !selectedBooking) ||
                    (isSubFolder && !folderName)
                      ? undefined
                      : "#0C3742",
                }}
                className={`
                        flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                        ${
                          isLoading ||
                          isFetching ||
                          (!isSubFolder && !selectedBooking) ||
                          (isSubFolder && !folderName)
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "text-white shadow-lg hover:opacity-90"
                        }
                    `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />{" "}
                    <span>Menyimpan...</span>
                  </>
                ) : isSubFolder ? (
                  "Buat Folder"
                ) : (
                  "Generate Folder"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
