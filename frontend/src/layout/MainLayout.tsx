import { type ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { NavigationSection } from "../components/sections/NavigationSection/NavigationSection";
import { useAuthManager } from "../hooks/auth";

export function MainLayout(): ReactNode {
  const { isAuthenticated, isLoading } = useAuthManager();
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsNavOpen(false);
      } else {
        setIsNavOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-[#f8f8f8] h-screen w-full overflow-hidden">
      <aside className="flex-shrink-0 h-screen w-[278px] fixed left-0 top-0">
        <NavigationSection isOpen={isNavOpen} toggleNav={toggleNav} />
      </aside>
      <Outlet context={{ isNavOpen }} />
    </div>
  );
}
