"use client";

import React, { useState, useRef } from "react";
import { X, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createPackage, uploadImage } from "@/services/admin-service.service";

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback untuk refresh data di parent
}

export default function AddPackageModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPackageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
  });

  // File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Input Text
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Buat preview lokal biar user bisa lihat gambar sebelum upload
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalFotoUrl = "";

      // 1. Upload Foto Dulu (Jika ada file dipilih)
      if (selectedFile) {
        // Panggil service upload
        // Note: Pastikan kamu punya endpoint upload di backend, atau ganti ini dengan string dummy dulu jika belum ada
        finalFotoUrl = await uploadImage(selectedFile);
      } else {
        // Jika wajib ada foto tapi user ga pilih, throw error atau pakai placeholder
        // finalFotoUrl = "https://placehold.co/600x400"; // Dummy fallback
        alert("Harap pilih foto terlebih dahulu!");
        setIsLoading(false);
        return;
      }

      // 2. Kirim Data ke API Create Konsep
      const payload = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        fotoUrl: finalFotoUrl,
        // isActive default true di backend atau database
      };

      await createPackage(payload);

      // 3. Sukses
      onSuccess(); // Refresh tabel parent
      onClose(); // Tutup modal

      // Reset Form
      setFormData({ judul: "", deskripsi: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan paket. Pastikan backend upload ready.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Tambah Paket Baru
            </h3>
            <p className="text-xs text-gray-400">
              Isi detail paket layanan studio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form
            id="add-package-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* 1. Upload Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Foto Sampul <span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                  ${
                    previewUrl
                      ? "border-slate-300"
                      : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                  }
                `}
              >
                {previewUrl ? (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <p className="text-white text-sm font-bold flex items-center gap-2">
                        <Upload size={16} /> Ganti Foto
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <div className="p-3 bg-slate-100 rounded-full mb-2 group-hover:bg-blue-100 group-hover:text-blue-500 transition">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      Klik untuk upload foto
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Maksimal 2MB (JPG/PNG)
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* 2. Judul Paket */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                required
                placeholder="Contoh: Wedding Exclusive"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 focus:ring-0 transition text-sm font-semibold text-slate-700 placeholder:font-normal"
                value={formData.judul}
                onChange={handleChange}
              />
            </div>

            {/* 3. Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                rows={4}
                required
                placeholder="Jelaskan detail paket ini..."
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 focus:ring-0 transition text-sm text-slate-700 resize-none"
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            form="add-package-form"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-2 shadow-lg shadow-slate-200"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
