"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import {
  createConcept,
  uploadImageKonsep,
  fetchPackages,
} from "@/services/admin-service.service"; // Import fetchPackages

interface AddConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddConceptModal({
  isOpen,
  onClose,
  onSuccess,
}: AddConceptModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data Paket untuk Dropdown
  const [packages, setPackages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nama: "", // Sesuai DTO Layanan (nama)
    harga: "",
    deskripsi: "",
    konsepId: "", // ID Paket Induk
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load Paket saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchPackages().then((data) => setPackages(data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalFotoUrl = "";
      if (selectedFile) {
        finalFotoUrl = await uploadImageKonsep(selectedFile);
      } else {
        alert("Harap pilih foto visual!");
        setIsLoading(false);
        return;
      }

      // Validasi Manual
      if (!formData.konsepId) {
        alert("Harap pilih Paket Induk!");
        setIsLoading(false);
        return;
      }

      const payload = {
        nama: formData.nama,
        harga: Number(formData.harga), // Convert string to number
        deskripsi: formData.deskripsi,
        fotoUrl: finalFotoUrl,
        konsepId: Number(formData.konsepId), // Wajib
        isActive: true,
      };

      await createConcept(payload);
      onSuccess();
      onClose();

      // Reset
      setFormData({ nama: "", harga: "", deskripsi: "", konsepId: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error;
      console.error("Gagal menyimpan Konsep:", err?.response?.status, err?.response?.data || err.message);
      const serverMessage = err?.response?.data?.message || err?.response?.data || err.message;
      alert(`Gagal menyimpan Konsep: ${serverMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Tambah Konsep (Layanan)
            </h3>
            <p className="text-xs text-gray-400">
              Buat sub-layanan baru di bawah paket
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form
            id="add-concept-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Foto */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Foto Visual <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                  previewUrl
                    ? "border-slate-300"
                    : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon size={24} />
                    <p className="text-xs mt-1">Upload Foto</p>
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

            {/* Nama Layanan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Nama Layanan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                required
                placeholder="Contoh: Foto Studio Wisuda"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 text-sm font-semibold"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            {/* Paket Induk (Dropdown) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Paket Induk <span className="text-red-500">*</span>
              </label>
              <select
                name="konsepId"
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 text-sm"
                value={formData.konsepId}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Pilih Paket
                </option>
                {packages.map((pkg: any) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.judul}
                  </option>
                ))}
              </select>
            </div>

            {/* Harga */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                name="harga"
                required
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 text-sm"
                value={formData.harga}
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
                rows={3}
                required
                placeholder="Detail layanan..."
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 text-sm resize-none"
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200"
          >
            Batal
          </button>
          <button
            type="submit"
            form="add-concept-form"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}{" "}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
