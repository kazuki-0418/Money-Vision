import type { JSX } from "react";
import { Button } from "../../ui/button";

export function NavigationItem({
  item,
  currentPath,
  onClick,
}: {
  item: {
    label: string;
    value: string;
    icon: JSX.Element;
  };
  currentPath: string;
  onClick?: () => void;
}) {
  return (
    <Button
      key={item.label}
      variant="ghost"
      disabled={currentPath === `/${item.value}`}
      onClick={() => {
        window.location.href = `/${item.value}`;
        if (onClick) {
          onClick();
        }
      }}
      className={`flex w-[200px] my-2 items-center gap-3.5 px-4 py-2 justify-start ${
        currentPath === `/${item.value}`
          ? "bg-[#204f4c] text-white rounded-[20px] shadow-[0px_4px_4px_#00000040]"
          : "text-[#342e30] hover:bg-gray-100 hover:cursor-pointer"
      }

`}
    >
      {item.icon}

      {item.label}
    </Button>
  );
}
