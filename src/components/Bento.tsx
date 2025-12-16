import React from "react";
import Image from "next/image";

// Anda bisa mengganti path ini dengan gambar asli di folder public/images/
const images = [
  "/bento/bento1.png",
  "/bento/bento2.png",
  "/bento/bento3.png",
  "/bento/bento4.png",
  "/bento/bento5.png",
  "/bento/bento6.png",
];

export const Bento: React.FC = () => {
  return (
    <div className="w-full relative overflow-hidden flex flex-col items-start p-8 box-border gap-8">
      {/* Baris Pertama */}
      <div className="self-stretch overflow-hidden flex flex-col md:flex-row items-start gap-8">
        <div className="relative h-[251px] w-full md:w-[517px] rounded-[40px] overflow-hidden">
          <Image
            src={images[0]}
            alt="Portfolio 1"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative h-[251px] flex-1 w-full rounded-[40px] overflow-hidden">
          <Image
            src={images[1]}
            alt="Portfolio 2"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="relative h-[251px] w-full md:w-[376px] rounded-[40px] overflow-hidden">
          <Image
            src={images[2]}
            alt="Portfolio 3"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Baris Kedua */}
      <div className="self-stretch min-h-[426px] overflow-hidden shrink-0 flex flex-col md:flex-row items-start gap-8">
        <div className="relative h-[426px] flex-1 w-full rounded-[40px] overflow-hidden">
          <Image
            src={images[3]}
            alt="Portfolio 4"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="relative h-[426px] w-full md:w-[687px] rounded-[40px] overflow-hidden">
          <Image
            src={images[4]}
            alt="Portfolio 5"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative h-[426px] flex-1 w-full rounded-[40px] overflow-hidden">
          <Image
            src={images[5]}
            alt="Portfolio 6"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
};
