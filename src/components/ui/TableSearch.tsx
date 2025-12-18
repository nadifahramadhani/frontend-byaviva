"use client";
import React from "react";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const TableSearch = ({
  value,
  onChange,
  placeholder = "Cari...",
}: Props) => {
  return (
    <div className="relative w-full md:w-72">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-sm transition-all shadow-sm"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
    </div>
  );
};
