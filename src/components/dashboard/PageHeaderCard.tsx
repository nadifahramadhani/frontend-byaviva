import React from "react";

interface PageHeaderCardProps {
  title: string;
  subtitle?: string;
}

export const PageHeaderCard: React.FC<PageHeaderCardProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="w-full bg-white rounded-[10px_10px_50px_50px] p-6 sm:p-8 shadow-sm">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>

      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};
