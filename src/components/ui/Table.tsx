import React from "react";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[]; // Array konfigurasi kolom
  isLoading?: boolean;
}

// Kita import ColumnDef dari file types agar TypeScript mengenali
import { ColumnDef } from "@/types";

export const Table = <T,>({ data, columns, isLoading }: TableProps<T>) => {
  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500 font-nunito-sans">
        Loading data...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 font-nunito-sans">
        Tidak ada data untuk ditampilkan.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        {/* --- HEADER DINAMIS --- */}
        <thead className="bg-[#335C67] text-white font-nunito-sans text-sm">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-4 font-bold tracking-wide ${
                  col.headerClassName || ""
                } ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* --- BODY DINAMIS --- */}
        <tbody className="text-slate-700 font-nunito-sans text-[15px] font-semibold">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-100 hover:bg-slate-50 transition-colors last:border-0"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={`p-4 ${col.className || ""}`}
                >
                  {/* Panggil fungsi render yang didefinisikan di config */}
                  {col.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
