"use client";

import React from "react";

interface FolderCardProps {
  title?: string;
  date?: string;
  isUploading?: boolean;
  uploadedCount?: number;
  totalCount?: number;
  folderColor?: string; // Hex color untuk folder
}

const FolderCard: React.FC<FolderCardProps> = ({
  title = "Nadifah Ramadhani",
  date = "23/09/2025",
  isUploading = true,
  uploadedCount = 50,
  totalCount = 100,
  folderColor = "#375561", // Warna Teal Gelap
}) => {
  const statusText = isUploading ? "uploading...." : "Completed";

  return (
    // 1. CONTAINER WRAPPER
    <div className="flex flex-col gap-3 w-full max-w-[300px] group cursor-pointer">
      {/* 2. FRAME BACKGROUND ABU-ABU */}
      <div className="relative w-full aspect-[1.4/1] bg-[#C0CCD0] rounded-2xl pt-8 overflow-hidden flex flex-col justify-end shadow-sm transition-transform group-hover:-translate-y-1">
        {/* 3. WRAPPER BENTUK FOLDER */}
        <div className="relative w-full h-full flex flex-col justify-end">
          {/* A. TAB ATAS */}
          <div
            className="w-[45%] h-[22%] rounded-t-xl relative z-20 -mb-[2px]"
            style={{ backgroundColor: folderColor }}
          />

          {/* B. BODY BAWAH */}
          <div
            className="w-full h-[78%] rounded-b-2xl rounded-tr-xl rounded-tl-none shadow-md relative z-10"
            style={{ backgroundColor: folderColor }}
          >
            {/* Optional: Garis lipatan halus */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-black/5 z-30 rounded-tr-xl"></div>
          </div>
        </div>
      </div>

      {/* 4. TEXT CONTENT */}
      <div className="px-1">
        {/* UPDATE DISINI: group-hover:text-[#335C67] */}
        <h3 className="font-montserrat font-bold text-[15px] md:text-[16px] leading-tight text-black m-0 group-hover:text-[#335C67] transition-colors">
          {title} - <br className="hidden md:block" /> {date}
        </h3>
        <div className="flex justify-between items-center mt-2 font-lato text-[11px] md:text-[12px] font-bold text-gray-700">
          <span className={isUploading ? "animate-pulse text-blue-600" : ""}>
            {statusText}
          </span>
          <span>
            {uploadedCount}/{totalCount}Photos
          </span>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
