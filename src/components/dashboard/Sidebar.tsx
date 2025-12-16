import { FileText, Folder, Image, LogOut } from "lucide-react";
import { ToolbarItemSidebar } from "./ToolbarItemSidebar";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: FileText,
    active: true,
  },
  {
    label: "Riwayat",
    icon: Folder,
  },
  {
    label: "Gallery",
    icon: Image,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-[280px] h-screen bg-white flex flex-col justify-between border-r">
      <nav className="pt-24 px-6 flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <ToolbarItemSidebar
              key={item.label}
              text={item.label}
              property1={item.active ? "active" : "default"}
              icon={<Icon className="w-5 h-5" />}
              className="h-12"
            />
          );
        })}
      </nav>

      <div className="px-6 pb-6">
        <ToolbarItemSidebar
          text="Log Out"
          property1="default"
          icon={<LogOut className="w-5 h-5 text-red-600" />}
        />
      </div>
    </aside>
  );
};
