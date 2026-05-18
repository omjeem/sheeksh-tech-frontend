import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import Tile, { type TileTone } from "./tile";

interface StatProps {
  label: string;
  value: React.ReactNode;
  delta?: string;
  deltaDir?: "up" | "down";
  icon?: LucideIcon;
  tone?: TileTone;
  className?: string;
}

export default function Stat({
  label,
  value,
  delta,
  deltaDir = "up",
  icon,
  tone = "brand",
  className,
}: StatProps) {
  return (
    <div className={cn("stat", className)}>
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        {icon && <Tile tone={tone} icon={icon} size={28} />}
      </div>
      <div className="value">{value}</div>
      {delta && (
        <div className={cn("delta", deltaDir === "down" && "down")}>
          {deltaDir === "down" ? (
            <ArrowDown size={12} strokeWidth={2} />
          ) : (
            <ArrowUp size={12} strokeWidth={2} />
          )}
          {delta}
        </div>
      )}
    </div>
  );
}
