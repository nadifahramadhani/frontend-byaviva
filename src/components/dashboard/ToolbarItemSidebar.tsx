import React, { ReactNode } from "react";

interface ToolbarItemSidebarProps {
  className?: string; // Menerima class tambahan dari luar
  divClassName?: string; // Class untuk text
  icon: ReactNode;
  property1: "default" | "active";
  text?: string;
}

export const ToolbarItemSidebar = ({
  className,
  divClassName,
  icon,
  property1,
  text,
}: ToolbarItemSidebarProps) => {
  // Base style: Flexbox, spacing, rounded corners
  const baseClasses =
    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer group font-medium text-sm";

  // Active vs Default styles
  const activeClasses =
    property1 === "active"
      ? "bg-slate-800 text-white shadow-md translate-x-1" // Active: Gelap, text putih, geser dikit
      : "text-gray-500 hover:bg-gray-100 hover:text-slate-800 hover:translate-x-1"; // Default: Abu, hover jadi gelap

  return (
    <div className={`${baseClasses} ${activeClasses} ${className || ""}`}>
      {/* Icon Container */}
      <div
        className={`flex-shrink-0 ${
          property1 === "active" ? "text-white" : "text-current"
        }`}
      >
        {icon}
      </div>

      {/* Text Label */}
      {text && (
        <span className={`whitespace-nowrap ${divClassName || ""}`}>
          {text}
        </span>
      )}
    </div>
  );
};
