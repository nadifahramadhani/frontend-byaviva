import React from "react";
import { Search, Bell } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <header className="w-full bg-[#F0F8FF] rounded-t-[40px] px-[40px] md:px-[60px] py-[30px] flex items-center justify-between border-b border-gray-100">
      {/* LEFT: Titles */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-slate-800 font-montserrat tracking-tight">
          {title}
        </h1>
        <p className="text-[14px] md:text-[16px] text-gray-500 font-lato font-medium">
          {subtitle}
        </p>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Search Bar */}
        <div className="hidden md:flex w-80 bg-white border border-gray-300 rounded-lg items-center px-4 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <input
            type="text"
            placeholder="Search Data..."
            className="flex-1 outline-none text-[14px] font-lato text-slate-700 placeholder-gray-400"
          />
          <Search size={20} className="text-gray-400" />
        </div>

        {/* Notification Bell */}
        <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:text-blue-600 text-gray-600 transition-colors shadow-sm relative">
          <Bell size={20} />
          {/* Optional: Titik merah notifikasi */}
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};
