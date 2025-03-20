import type React from "react";
import type { JSX } from "react";

import { cn } from "../../lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function Card({ className, ...props }: Props): JSX.Element {
  return (
    <div
      className={cn("rounded-xl border-[#888888] bg-white text-card-foreground shadow", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: Props): JSX.Element {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: Props): JSX.Element {
  return <div className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: Props): JSX.Element {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: Props): JSX.Element {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: Props): JSX.Element {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
