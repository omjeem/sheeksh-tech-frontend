"use client";
import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export default function Chip({
  active,
  children,
  className,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn("chip", active && "active", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
