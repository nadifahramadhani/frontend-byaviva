"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { uploadGalleryPhotos } from "@/services/admin-service.service";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folderId: number;
  folderName: string;
}

export default function UploadPhotoModal({
  isOpen,
  onClose,
  onSuccess,
  folderId,
  folderName,
}: UploadPhotoModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Reset state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFiles([]);
      setPreviews([]);
      setError("");
      setIsUploading(false);
    }
  }, [isOpen]);

  // Handle File Input Change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  // Logic memproses file (validasi & preview)
  const processFiles = (newFiles: File[]) => {
    setError("");

    // Validasi Limit (Backend max 20)
    if (files.length + newFiles.length > 20) {
      setError("Maksimal upload 20 foto sekaligus.");
      return;
    }

    // Validasi Tipe File (Hanya Gambar)
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length !== newFiles.length) {
      setError("Beberapa file diabaikan karena bukan gambar.");
    }

    // Generate Preview URL
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Hapus file dari antrian
  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];

    // Revoke URL object agar tidak memory leak
    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  // Submit Upload
  const handleSubmit = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setError("");

    try {
      await uploadGalleryPhotos(folderId, files);
      onSuccess(); // Refresh parent
      onClose(); // Tutup modal
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal mengupload foto.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col h-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0C3742]/10 rounded-xl flex items-center justify-center text-[#0C3742] shrink-0">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">
                Upload Foto
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                Ke folder: <b>{folderName}</b>
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
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* DRAG & DROP ZONE */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                    border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative
                    ${
                      isDragOver
                        ? "border-[#0C3742] bg-[#0C3742]/5"
                        : "border-slate-200 hover:border-[#0C3742]/50 hover:bg-slate-50"
                    }
                `}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                isDragOver
                  ? "bg-[#0C3742] text-white"
                  : "bg-slate-100 text-slate-400 group-hover:bg-[#0C3742]/10 group-hover:text-[#0C3742]"
              }`}
            >
              <ImageIcon size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-700">
              Klik atau Drag & Drop foto di sini
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Maksimal 20 foto per upload (JPG, PNG)
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* PREVIEW GRID */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Antrian Upload ({files.length})
                </span>
                <button
                  onClick={() => {
                    setFiles([]);
                    setPreviews([]);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Hapus Semua
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {previews.map((src, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
                  >
                    <img
                      src={src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex gap-3 mt-auto bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || isUploading}
            style={{
              backgroundColor:
                files.length === 0 || isUploading ? undefined : "#0C3742",
            }}
            className={`
                    flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${
                      files.length === 0 || isUploading
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "text-white shadow-lg hover:opacity-90"
                    }
                `}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Mengupload ({files.length})...</span>
              </>
            ) : (
              `Upload ${files.length > 0 ? files.length + " Foto" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
