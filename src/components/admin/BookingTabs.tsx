import React from "react";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface BookingTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const BookingTabs = ({
  tabs,
  activeTab,
  onChange,
}: BookingTabsProps) => {
  return (
    <div className="NavigationItems self-stretch px-5 py-2.5 bg-slate-100 rounded-[20px] inline-flex justify-start items-start gap-6 w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`TabBase flex-1 py-3 flex justify-start items-center gap-2 transition-all border-b-2 ${
            activeTab === tab.id ? "border-slate-800" : "border-transparent"
          }`}
        >
          <div
            className={`Label text-center justify-start text-base font-bold font-nunito-sans leading-5 tracking-wide ${
              activeTab === tab.id ? "text-slate-800" : "text-zinc-600"
            }`}
          >
            {tab.count !== undefined ? `${tab.count} ` : ""}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
};
