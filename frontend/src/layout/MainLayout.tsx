import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { NavigationSection } from "../components/sections/NavigationSection/NavigationSection";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function MainLayout(): ReactNode {
  return (
    <ProtectedRoute>
      <div className="flex bg-[#f8f8f8] h-screen w-full overflow-hidden">
        <aside className="flex-shrink-0 h-screen w-[278px] fixed left-0 top-0">
          <NavigationSection />
        </aside>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
