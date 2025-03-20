import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { NavigationSection } from "../components/sections/NavigationSection/NavigationSection";

export function MainLayout(): ReactNode {
  return (
    <div className="flex bg-[#f8f8f8] h-screen w-full overflow-hidden">
      <aside className="flex-shrink-0 h-screen w-[278px] fixed left-0 top-0">
        <NavigationSection />
      </aside>
      <Outlet />
    </div>
  );
}
