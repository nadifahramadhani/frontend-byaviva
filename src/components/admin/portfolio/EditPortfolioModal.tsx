"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { updatePortfolio } from "@/services/admin-service.service";

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: any;
}

export default function EditPortfolioModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: EditPortfolioModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    klien: "",
    fotoUrl: "",
    deskripsi: "",
    tanggal: "",
  });

  // Load data awal saat modal dibuka
  useEffect(() => {
    if (initialData) {
      setFormData({
        judul: initialData.judul || "",
        kategori: initialData.kategori || "",
        klien: initialData.klien || "",
        fotoUrl: initialData.fotoUrl || "",
        deskripsi: initialData.deskripsi || "",
        // Convert ISO date string to YYYY-MM-DD for input type="date"
        tanggal: initialData.tanggal
          ? new Date(initialData.tanggal).toISOString().split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updatePortfolio(initialData.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal update portofolio");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-slate-800">Edit Portofolio</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Field sama seperti Add Modal */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Judul
            </label>
            <input
              required
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Kategori
              </label>
              <input
                required
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Klien
              </label>
              <input
                required
                name="klien"
                value={formData.klien}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Tanggal Acara
            </label>
            <input
              required
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              type="date"
              className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Foto URL
            </label>
            <input
              name="fotoUrl"
              value={formData.fotoUrl}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 border rounded-xl text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl text-sm outline-none h-24 resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={18} /> Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
