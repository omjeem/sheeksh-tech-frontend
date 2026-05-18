import { cn } from "@/lib/utils";
import type { TileTone } from "./tile";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-[12px]",
  lg: "h-10 w-10 text-[14px]",
  xl: "h-14 w-14 text-[18px]",
};

const toneMap: Record<TileTone, string> = {
  brand: "bg-brand-soft text-brand-ink",
  teal: "bg-teal-soft text-teal-ink",
  success: "bg-success-soft text-success-ink",
  warning: "bg-warning-soft text-warning-ink",
  danger: "bg-danger-soft text-danger-ink",
  info: "bg-info-soft text-info-ink",
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function pickTone(seed: string): TileTone {
  const tones: TileTone[] = [
    "brand",
    "teal",
    "warning",
    "success",
    "info",
    "danger",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return tones[h % tones.length];
}

interface InitialsAvatarProps {
  name: string;
  size?: AvatarSize;
  tone?: TileTone;
  className?: string;
}

export default function InitialsAvatar({
  name,
  size = "md",
  tone,
  className,
}: InitialsAvatarProps) {
  const t = tone ?? pickTone(name || "?");
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-full font-semibold shrink-0 select-none",
        sizeMap[size],
        toneMap[t],
        className,
      )}
      style={{ letterSpacing: "-0.01em" }}
    >
      {initialsOf(name || "?")}
    </span>
  );
}
