import React from "react";
import { ListFilter, ChevronDown, ArrowDownWideNarrow } from "lucide-react";

export const FilterActions = () => {
  return (
    <div className="Filter self-stretch inline-flex justify-end items-center gap-3.5 w-full mt-6">
      {/* Tombol Filter */}
      <button className="Button px-5 py-3 bg-slate-600 hover:bg-slate-700 transition-colors rounded-lg flex justify-center items-center gap-2 overflow-hidden">
        <ListFilter size={18} className="text-white" />
        <span className="Label justify-start text-white text-sm font-bold font-nunito-sans leading-4 tracking-wide">
          Filter
        </span>
        <ChevronDown size={16} className="text-white" />
      </button>

      {/* Tombol Sort By */}
      <button className="Button px-5 py-3 bg-slate-600 hover:bg-slate-700 transition-colors rounded-lg flex justify-center items-center gap-2 overflow-hidden">
        <ArrowDownWideNarrow size={18} className="text-white" />
        <span className="Label justify-start text-white text-sm font-bold font-nunito-sans leading-4 tracking-wide">
          Sort By
        </span>
        <ChevronDown size={16} className="text-white" />
      </button>
    </div>
  );
};
