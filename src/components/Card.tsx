import React from "react";

interface CardProps {
  className?: string;
  imageContentClassName?: string;
  property1?: string;
}

export const Card = ({ className, imageContentClassName }: CardProps) => {
  return (
    <div
      className={`w-[320px] h-[380px] bg-white p-4 shadow-md flex flex-col items-center ${
        className || ""
      }`}
    >
      {/* Area Gambar */}
      <div
        className={`w-full h-full bg-cover bg-center ${
          imageContentClassName || ""
        }`}
      />
    </div>
  );
};
