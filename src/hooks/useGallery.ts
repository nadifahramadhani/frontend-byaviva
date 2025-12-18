// src/hooks/useGallery.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { FolderData, FolderDetail } from "@/types/gallery";

export const useGallery = (endpoint: string) => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi fetch kita keluarkan agar bisa dipanggil ulang (refresh)
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(endpoint);
      const data = res.data;

      // Validasi Array
      if (Array.isArray(data)) {
        setFolders(data);
      } else if (data && Array.isArray(data.data)) {
        setFolders(data.data);
      } else {
        setFolders([]);
      }
    } catch (err: any) {
      console.error("Gallery Fetch Error:", err);
      setError(
        err.response?.data?.message || err.message || "Gagal memuat data"
      );
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]); // Fetch ulang jika endpoint berubah

  return { folders, isLoading, error, refetch: fetchData };
};

export const useFolderDetail = (folderId: string | string[] | undefined) => {
  const [folder, setFolder] = useState<FolderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!folderId) return;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/folders/${folderId}`);
        setFolder(res.data);
      } catch (err: any) {
        console.error("Gagal ambil detail folder:", err);
        setError(err.response?.data?.message || "Gagal memuat folder.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [folderId]);

  return { folder, isLoading, error };
};
