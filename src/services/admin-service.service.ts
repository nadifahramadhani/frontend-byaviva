import axiosInstance from "@/lib/axios";

// --- API UNTUK TAB "PAKET LAYANAN" ---
// (Menggunakan endpoint /konsep sesuai instruksi kamu)

export const fetchPackages = async () => {
  try {
    // Memanggil API Konsep (yang sebenarnya Paket)
    const response = await axiosInstance.get("/konsep/admin/all");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data paket:", error);
    throw error;
  }
};

// [BARU] Fungsi Upload Gambar
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // [UPDATE] URL endpoint berubah jadi /konsep/upload
    const response = await axiosInstance.post("/konsep/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  } catch (error) {
    console.error("Gagal upload gambar:", error);
    throw error;
  }
};

export const createPackage = async (data: any) => {
  try {
    // Data dikirim sebagai JSON sesuai DTO
    const response = await axiosInstance.post("/konsep/create", data);
    return response.data;
  } catch (error) {
    console.error("Gagal membuat paket:", error);
    throw error;
  }
};

export const updatePackage = async (id: number, data: any) => {
  try {
    // Sesuai controller: @Put('/update/:id')
    const response = await axiosInstance.put(`/konsep/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Gagal update paket:", error);
    throw error;
  }
};

// [UPDATE] Delete Paket (Pastikan path sesuai controller)
export const deletePackage = async (id: number) => {
  try {
    // Sesuai controller: @Delete('/delete/:id')
    await axiosInstance.delete(`/konsep/delete/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus paket:", error);
    throw error;
  }
};

// --- API UNTUK TAB "KONSEP FOTO" ---
// 1. Fetch All Layanan
export const fetchConcepts = async () => {
  try {
    const response = await axiosInstance.get("/layanan/admin/all");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data layanan:", error);
    return [];
  }
};

// 2. Create Layanan
export const createConcept = async (data: any) => {
  try {
    // Data wajib punya 'konsepId' (Paket Induk)
    const response = await axiosInstance.post("/layanan/create", data);
    return response.data;
  } catch (error) {
    // Tampilkan detail response jika tersedia supaya mudah debug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = error;
    console.error(
      "Gagal membuat layanan:",
      err?.response?.status,
      err?.response?.data || err.message
    );
    throw err;
  }
};

// 3. Update Layanan
export const updateConcept = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(`/layanan/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Gagal update layanan:", error);
    throw error;
  }
};

// 4. Delete Layanan
export const deleteConcept = async (id: number) => {
  try {
    await axiosInstance.delete(`/layanan/delete/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus layanan:", error);
    throw error;
  }
};

// [BARU] Fungsi Upload Gambar
export const uploadImageKonsep = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // [UPDATE] URL endpoint berubah jadi /layanan/upload
    const response = await axiosInstance.post("/layanan/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = error;
    console.error(
      "Gagal upload gambar:",
      err?.response?.status,
      err?.response?.data || err.message
    );
    throw err;
  }
};

// gallery
export const fetchGalleryFolders = async () => {
  try {
    // Call the endpoint you provided: http://localhost:3000/api/folders
    const response = await axiosInstance.get("/folders");
    return response.data;
  } catch (error) {
    console.error("Gagal ambil folder galeri:", error);
    return [];
  }
};

export const fetchFolderDetail = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/folders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Gagal ambil detail folder ID ${id}:`, error);
    return null;
  }
};

export const fetchBookingsList = async () => {
  try {
    const response = await axiosInstance.get("/booking/admin/all"); // Sesuaikan endpoint ini
    return response.data;
  } catch (error) {
    console.error("Gagal ambil data booking:", error);
    return [];
  }
};

// 2. Create Folder Manual
export const createFolderManual = async (bookingId: number) => {
  const response = await axiosInstance.post("/folders/create", { bookingId });
  return response.data;
};

// Create Sub-Folder Manual
export const createSubFolder = async (parentId: number, folderName: string) => {
  // NOTE: Pastikan backend punya endpoint POST /folders/create-subfolder
  // Body: { parentId, nama }
  const response = await axiosInstance.post("/folders/create-subfolder", {
    parentId,
    nama: folderName,
  });
  return response.data;
};

export const uploadGalleryPhotos = async (folderId: number, files: File[]) => {
  const formData = new FormData();

  // Append setiap file ke key 'files'
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(
    `/hasil-foto/upload/${folderId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteGalleryPhoto = async (photoId: number) => {
  const response = await axiosInstance.delete(`/hasil-foto/${photoId}`);
  return response.data;
};

// --- PORTOFOLIO SERVICE ---

export const fetchPortfolios = async () => {
  const response = await axiosInstance.get("/portofolio");
  return response.data;
};

export const createPortfolio = async (data: any) => {
  // Backend mengharapkan DTO JSON
  const response = await axiosInstance.post("/portofolio/create", data);
  return response.data;
};

export const updatePortfolio = async (id: number, data: any) => {
  const response = await axiosInstance.put(`/portofolio/update/${id}`, data);
  return response.data;
};

export const deletePortfolio = async (id: number) => {
  const response = await axiosInstance.delete(`/portofolio/delete/${id}`);
  return response.data;
};
