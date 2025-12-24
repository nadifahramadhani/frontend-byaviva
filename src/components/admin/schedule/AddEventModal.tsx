"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  Briefcase,
  User,
  Ban,
  AlignLeft,
  Calendar as CalIcon,
  Clock,
} from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSave,
}: AddEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Default state form
  const [formData, setFormData] = useState({
    title: "",
    tanggal: "",
    startTime: "",
    endTime: "",
    category: "WORK", // Default ke WORK
    deskripsi: "",
  });

  // Efek animasi muncul/hilang
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200); // Tunggu animasi selesai baru unmount
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (cat: string) => {
    setFormData({ ...formData, category: cat });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      // Reset form
      setFormData({
        title: "",
        tanggal: "",
        startTime: "",
        endTime: "",
        category: "WORK",
        deskripsi: "",
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- KATEGORI YANG DIIZINKAN (Tanpa BOOKING & DISKUSI) ---
  const CATEGORIES = [
    {
      id: "WORK",
      label: "Work / Meeting",
      icon: <Briefcase size={18} />,
      activeClass: "bg-slate-800 text-white border-slate-800 shadow-md",
      baseClass:
        "bg-white text-slate-600 border-gray-200 hover:border-slate-300",
    },
    {
      id: "PERSONAL",
      label: "Personal",
      icon: <User size={18} />,
      activeClass: "bg-blue-600 text-white border-blue-600 shadow-md",
      baseClass:
        "bg-white text-slate-600 border-gray-200 hover:border-blue-300",
    },
    {
      id: "BLOCK",
      label: "Block / Libur",
      icon: <Ban size={18} />,
      activeClass: "bg-red-500 text-white border-red-500 shadow-md",
      baseClass: "bg-white text-slate-600 border-gray-200 hover:border-red-300",
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop Blur */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`
          relative bg-white rounded-[28px] shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col max-h-[90vh]
          transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {/* Header Minimalis */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-50 bg-white">
          <div>
            <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">
              Tambah Jadwal
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Buat jadwal manual untuk kalender.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
          <form
            id="add-event-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* 1. Category Selector (Modern Cards) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Kategori Kegiatan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`
                      flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 cursor-pointer
                      ${
                        formData.category === cat.id
                          ? cat.activeClass
                          : cat.baseClass
                      }
                    `}
                  >
                    {cat.icon}
                    <span className="text-xs font-bold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Judul */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Judul
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Meeting Internal..."
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 rounded-xl border-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-800 transition"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 3. Tanggal & Waktu (Grid Layout) */}
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  <CalIcon size={12} /> Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-slate-800 transition"
                  value={formData.tanggal}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 flex gap-3">
                <div className="space-y-2 w-full">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    <Clock size={12} /> Mulai
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="w-full px-3 py-3 bg-slate-50 rounded-xl border-none text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-slate-800 transition text-center"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    <Clock size={12} /> Selesai
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="w-full px-3 py-3 bg-slate-50 rounded-xl border-none text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-slate-800 transition text-center"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 4. Deskripsi */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                <AlignLeft size={12} /> Deskripsi
              </label>
              <textarea
                name="deskripsi"
                rows={3}
                placeholder="Tambahkan catatan..."
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-800 transition resize-none"
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-50 flex gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            form="add-event-form"
            disabled={isLoading}
            className="flex-[2] px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:shadow-xl hover:translate-y-[-1px]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}
