"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import {
  updateConcept,
  uploadImageKonsep,
  fetchPackages,
} from "@/services/admin-service.service";

interface EditConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: any;
}

export default function EditConceptModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: EditConceptModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [packages, setPackages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    deskripsi: "",
    konsepId: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load Packages & Set Initial Data
  useEffect(() => {
    if (isOpen) {
      // Fetch Packages dulu
      fetchPackages().then((data) => setPackages(data));

      if (initialData) {
        setFormData({
          nama: initialData.nama || "",
          harga: initialData.harga?.toString() || "",
          deskripsi: initialData.deskripsi || "",
          konsepId: initialData.konsepId?.toString() || "",
        });
        setPreviewUrl(initialData.fotoUrl || null);
        setSelectedFile(null);
      }
    }
  }, [initialData, isOpen]);

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
      let finalFotoUrl = initialData.fotoUrl;
      if (selectedFile) {
        finalFotoUrl = await uploadImageKonsep(selectedFile);
      }

      const payload = {
        nama: formData.nama,
        harga: Number(formData.harga),
        deskripsi: formData.deskripsi,
        fotoUrl: finalFotoUrl,
        konsepId: Number(formData.konsepId),
      };

      await updateConcept(initialData.id, payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate layanan.");
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
            <h3 className="font-bold text-lg text-slate-800">Edit Konsep</h3>
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
            id="edit-concept-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Foto */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Foto Visual
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-40 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group"
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
                    <p className="text-xs">Ganti Foto</p>
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

            {/* Nama */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Nama Layanan
              </label>
              <input
                type="text"
                name="nama"
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-slate-800 text-sm font-semibold"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            {/* Paket Induk */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Paket Induk
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
            form="edit-concept-form"
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
