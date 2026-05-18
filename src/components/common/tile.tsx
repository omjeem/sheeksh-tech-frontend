import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type TileTone =
  | "brand"
  | "teal"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface TileProps {
  tone?: TileTone;
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export default function Tile({
  tone = "brand",
  icon: Icon,
  size = 36,
  className,
}: TileProps) {
  return (
    <span
      className={cn(`tile tile-${tone}`, className)}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.8} />
    </span>
  );
}
