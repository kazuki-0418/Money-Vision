import { IoBarChartOutline, IoBriefcaseOutline, IoSettingsOutline } from "react-icons/io5";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import type { JSX } from "react";
import { CiBellOn, CiHome, CiWallet } from "react-icons/ci";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoTrophyOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutApi } from "../../../api/auth";
import { useAuthManager } from "../../../hooks/auth";
import { useUserStore } from "../../../store/userStore";
import { Button } from "../../ui/button";
import { Tooltip } from "../../ui/tooltip";
import { NavigationItem } from "./NavigationItem";

export function NavigationSection(): JSX.Element {
  const navigate = useNavigate();
  const { logout } = useAuthManager();
  const { user } = useUserStore();
  const menuItems = [
    { icon: <CiHome className="h-6 w-6" />, label: "Home", value: "" },
    { icon: <IoTrophyOutline className="h-6 w-6" />, label: "Goals", value: "goals" },
    {
      icon: <CiWallet className="h-6 w-6" />,
      label: "Transaction",
      value: "transaction",
    },
    {
      icon: <IoBarChartOutline className="h-6 w-6" />,
      label: "Statistic",
      value: "statistic",
    },
    {
      icon: <IoBriefcaseOutline className="h-6 w-6" />,
      label: "Report",
      value: "report",
    },
  ];

  // Bottom menu items data
  const bottomMenuItems = [
    { icon: <CiBellOn className="h-6 w-6" />, label: "Notifications", value: "notifications" },
    { icon: <IoSettingsOutline className="h-6 w-6" />, label: "Settings", value: "settings" },
  ];

  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col bg-white h-full rounded-[5px] shadow-1 w-[278px]">
      <div className="flex justify-between items-center px-5 py-10">
        <img className="h-16 w-16 object-cover" alt="Logo" src="/logo-1.png" />
        <div className="text-[#24242c] text-2xl font-bold">MoneyVision</div>
      </div>

      <Separator className="w-full" />

      {/* Main Navigation Menu */}
      <div className="flex flex-col gap-[25px] items-start px-[29px] py-[27px]">
        {menuItems.map((item) => (
          <NavigationItem key={item.label} item={item} currentPath={currentPath} />
        ))}
      </div>

      <div className="mt-auto">
        <Separator className="w-full" />

        {/* Bottom Navigation Items */}
        <div className="p-4 space-y-4">
          {bottomMenuItems.map((item) => (
            <NavigationItem key={item.label} item={item} currentPath={currentPath} />
          ))}
        </div>

        <Separator className="w-full" />

        {/* User Profile Section */}
        <div className="flex bg-[#f6f8fa] h-[75px] justify-between items-center px-5">
          <div className="flex gap-2 items-center">
            <Avatar className="h-[30px] w-[30px]">
              <AvatarImage src="/ellipse-5.png" alt="User avatar" />
              <AvatarFallback>
                <span>{user?.username}</span>
              </AvatarFallback>
            </Avatar>
            <span className="text-[#342e30] text-lg font-medium tracking-[-0.18px]">Kazuki Jo</span>
          </div>
          <Tooltip
            content={
              <Button
                className="text-[#342e30] bg-gray-100 hover:bg-gray-200 hover:cursor-pointer"
                onClick={handleLogout}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Logout</title>
                  <path
                    d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4 19H12V21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3H12V5H4V19Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Logout</span>
              </Button>
            }
          >
            <FiMoreHorizontal className="h-6 w-6 hover:cursor-pointer" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
