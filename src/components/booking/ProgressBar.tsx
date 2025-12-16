"use client";

import React from "react";

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  // Daftar langkah sesuai desain
  const steps = ["Pra-Booking", "Booking", "Shoot", "Konfirmasi", "Pembayaran"];

  return (
    <div className="w-full mb-8 px-1 md:px-30">
      <div className="flex w-full overflow-hidden rounded-lg text-[10px] md:text-sm lg:text-base font-medium font-montserrat">
        {steps.map((label, index) => {
          const stepNum = index + 1;

          // --- LOGIKA 4 WARNA (Sesuai Request) ---
          // 1. Saat ini: Orange (#ffb703)
          // 2. Sudah terjadi: Moccasin (#ffe9b1)
          // 3. Akan datang: Cornsilk (#fff4d9)
          // 4. Belum terjadi: Oldlace (#fff8e6)

          let colorClass = "";

          if (stepNum === currentStep) {
            // 1. SAAT INI (Active) -> Orange
            // Paling mencolok, teks hitam tebal + shadow
            colorClass = "bg-[#ffb703] text-black font-bold z-10 shadow-md";
          } else if (stepNum < currentStep) {
            // 2. SUDAH TERJADI (Past) -> Moccasin
            // Sedikit lebih gelap dari warna muda, teks agak transparan
            colorClass = "bg-[#ffe9b1] text-black/70 font-medium";
          } else if (stepNum === currentStep + 1) {
            // 3. AKAN DATANG (Next) -> Cornsilk
            // Warna muda, teks lebih pudar
            colorClass = "bg-[#fff4d9] text-black/50";
          } else {
            // 4. BELUM TERJADI (Future) -> Oldlace
            // Paling pucat/putih, teks sangat pudar
            colorClass = "bg-[#fff8e6] text-black/30";
          }

          return (
            <div
              key={label}
              className={`
                relative flex-1 py-3 md:py-4 text-center transition-all duration-300 flex items-center justify-center
                ${colorClass}
              `}
              style={{
                // Logika CSS Clip-path (Panah/Chevron)
                clipPath:
                  index === steps.length - 1
                    ? "polygon(0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%)" // Element terakhir ujungnya kotak saja gak ada segitiga
                    : "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",

                // Trik margin minus agar panah saling menumpuk rapi
                marginLeft: index === 0 ? 0 : "-15px",
                paddingLeft: index === 0 ? 0 : "20px",
                zIndex: steps.length - index, // Element kiri harus di atas element kanan
              }}
            >
              <span className="relative z-20 leading-tight">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
