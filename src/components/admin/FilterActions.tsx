import React, { useState, useRef, useEffect } from "react";
import {
  ListFilter,
  ChevronDown,
  ArrowDownWideNarrow,
  Check,
  Box,
} from "lucide-react";

interface FilterActionsProps {
  onStatusChange?: (status: string) => void;
  onPackageChange?: (pkg: string) => void;
  onSortChange?: (sort: string) => void;

  packageOptions?: { label: string; value: string }[];
  statusOptions?: { label: string; value: string }[]; // 👈 [BARU] Props untuk Custom Status
}

export const FilterActions = ({
  onStatusChange,
  onPackageChange,
  onSortChange,
  packageOptions = [],
  statusOptions = [], // 👈 [BARU] Default array kosong
}: FilterActionsProps) => {
  const [showStatus, setShowStatus] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [activeStatus, setActiveStatus] = useState("all");
  const [activePackage, setActivePackage] = useState("all");
  const [activeSort, setActiveSort] = useState("newest");

  const statusRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // --- LOGIC STATUS LIST ---
  // Default untuk halaman History (Selesai/Batal)
  const defaultHistoryStatuses = [
    { label: "Semua Status", value: "all" },
    { label: "Selesai (Completed)", value: "completed" },
    { label: "Dibatalkan (Canceled)", value: "canceled" },
    { label: "Ditolak (Rejected)", value: "rejected" },
  ];

  // Jika parent mengirim statusOptions, pakai itu. Jika tidak, pakai default history.
  const statusesToRender =
    statusOptions.length > 0
      ? [{ label: "Semua Status", value: "all" }, ...statusOptions]
      : defaultHistoryStatuses;

  // --- LOGIC PAKET LIST ---
  const defaultPackages = [
    { label: "Semua Paket", value: "all" },
    { label: "After Dusk", value: "After Dusk" },
    { label: "Stroll With You", value: "Stroll With You" },
    { label: "Wedding", value: "Wedding" },
    { label: "Prewedding", value: "Prewedding" },
  ];

  const packagesToRender =
    packageOptions.length > 0
      ? [{ label: "Semua Paket", value: "all" }, ...packageOptions]
      : defaultPackages;

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (statusRef.current && !statusRef.current.contains(target))
        setShowStatus(false);
      if (packageRef.current && !packageRef.current.contains(target))
        setShowPackage(false);
      if (sortRef.current && !sortRef.current.contains(target))
        setShowSort(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusClick = (value: string) => {
    setActiveStatus(value);
    if (onStatusChange) onStatusChange(value);
    setShowStatus(false);
  };

  const handlePackageClick = (value: string) => {
    setActivePackage(value);
    if (onPackageChange) onPackageChange(value);
    setShowPackage(false);
  };

  const handleSortClick = (value: string) => {
    setActiveSort(value);
    if (onSortChange) onSortChange(value);
    setShowSort(false);
  };

  const getButtonStyle = (isActive: boolean) =>
    `px-5 py-3 transition-colors rounded-lg flex justify-center items-center gap-2 overflow-hidden ${
      isActive
        ? "bg-slate-800 ring-2 ring-slate-400 text-white"
        : "bg-slate-600 hover:bg-slate-700 text-white"
    }`;

  const getDropdownItemStyle = (isSelected: boolean) =>
    `w-full text-left px-3 py-2.5 text-sm rounded-lg flex justify-between items-center transition ${
      isSelected
        ? "bg-slate-50 text-slate-800 font-bold"
        : "text-slate-600 hover:bg-gray-50"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 1. FILTER STATUS (DINAMIS) */}
      <div className="relative" ref={statusRef}>
        <button
          onClick={() => setShowStatus(!showStatus)}
          className={getButtonStyle(activeStatus !== "all")}
        >
          <ListFilter size={18} />
          <span className="text-sm font-bold font-nunito-sans tracking-wide">
            Status
          </span>
          <ChevronDown size={16} />
        </button>

        {showStatus && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[300px] overflow-y-auto">
            <div className="p-1.5 space-y-0.5">
              {statusesToRender.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusClick(opt.value)}
                  className={getDropdownItemStyle(activeStatus === opt.value)}
                >
                  <span className="truncate">{opt.label}</span>
                  {activeStatus === opt.value && (
                    <Check size={16} className="text-slate-800 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. FILTER PAKET */}
      <div className="relative" ref={packageRef}>
        <button
          onClick={() => setShowPackage(!showPackage)}
          className={getButtonStyle(activePackage !== "all")}
        >
          <Box size={18} />
          <span className="text-sm font-bold font-nunito-sans tracking-wide">
            Paket
          </span>
          <ChevronDown size={16} />
        </button>

        {showPackage && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[300px] overflow-y-auto">
            <div className="p-1.5 space-y-0.5">
              {packagesToRender.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handlePackageClick(opt.value)}
                  className={getDropdownItemStyle(activePackage === opt.value)}
                >
                  <span className="truncate">{opt.label}</span>
                  {activePackage === opt.value && (
                    <Check size={16} className="text-slate-800 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. SORT BY */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setShowSort(!showSort)}
          className={getButtonStyle(false)}
        >
          <ArrowDownWideNarrow size={18} />
          <span className="text-sm font-bold font-nunito-sans tracking-wide">
            Sort By
          </span>
          <ChevronDown size={16} />
        </button>

        {showSort && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-1.5 space-y-0.5">
              {[
                { label: "Terbaru (Newest)", value: "newest" },
                { label: "Terlama (Oldest)", value: "oldest" },
                { label: "Harga Tertinggi", value: "price_high" },
                { label: "Harga Terendah", value: "price_low" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortClick(opt.value)}
                  className={getDropdownItemStyle(activeSort === opt.value)}
                >
                  {opt.label}
                  {activeSort === opt.value && (
                    <Check size={16} className="text-slate-800" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
