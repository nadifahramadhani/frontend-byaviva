"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { updatePackage, uploadImage } from "@/services/admin-service.service";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: any; // Data paket yang sedang diedit
}

export default function EditPackageModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: EditPackageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Efek: Saat modal dibuka / data berubah, isi form dengan data lama
  useEffect(() => {
    if (initialData) {
      setFormData({
        judul: initialData.judul || "",
        deskripsi: initialData.deskripsi || "",
      });
      // Tampilkan foto lama jika ada
      setPreviewUrl(initialData.fotoUrl || null);
      setSelectedFile(null); // Reset file baru
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Preview foto baru
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalFotoUrl = initialData.fotoUrl; // Default pakai foto lama

      // Jika user memilih file baru, upload dulu
      if (selectedFile) {
        finalFotoUrl = await uploadImage(selectedFile);
      }

      const payload = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        fotoUrl: finalFotoUrl,
      };

      // Panggil API Update
      await updatePackage(initialData.id, payload);

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate paket.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Edit Paket</h3>
            <p className="text-xs text-gray-400">
              Perbarui informasi paket layanan
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
            id="edit-package-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Foto Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Foto Sampul
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-48 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group"
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <p className="text-white text-sm font-bold flex items-center gap-2">
                        <Upload size={16} /> Ganti Foto
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon size={24} className="mb-2" />
                    <p className="text-sm">Upload Foto Baru</p>
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

            {/* Judul */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Nama Paket
              </label>
              <input
                type="text"
                name="judul"
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 focus:ring-0 transition text-sm font-semibold text-slate-700"
                value={formData.judul}
                onChange={handleChange}
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                rows={4}
                required
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
            form="edit-package-form"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-2 shadow-lg shadow-slate-200"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}{" "}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
