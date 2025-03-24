import { Text } from "@radix-ui/themes";
import type React from "react";
import { cn } from "../../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  icon?: React.ReactNode;
};

export function Input({
  className,
  type = "text",
  error,
  icon,
  name,
  ...props
}: InputProps): React.JSX.Element {
  return (
    <div className="relative w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            error && "border-red-500 focus-visible:ring-red-500",
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <Text as="p" size="1" color="red" className="mt-1">
          {error}
        </Text>
      )}
    </div>
  );
}
