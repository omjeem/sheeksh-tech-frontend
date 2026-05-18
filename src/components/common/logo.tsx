import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWord?: boolean;
  word?: string;
  className?: string;
  invert?: boolean;
}

const sizeMap = {
  sm: { box: "h-6 w-6 rounded-md text-[14px]", text: "text-[13px]" },
  md: { box: "h-7 w-7 rounded-lg text-[17px]", text: "text-[15px]" },
  lg: { box: "h-9 w-9 rounded-xl text-[22px]", text: "text-[17px]" },
  xl: { box: "h-11 w-11 rounded-2xl text-[26px]", text: "text-[20px]" },
};

export default function Logo({
  size = "md",
  showWord = true,
  word = "Shiksha Tech",
  className,
  invert = false,
}: LogoProps) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight",
        invert ? "text-white" : "text-ink",
        className,
      )}
    >
      <span
        className={cn(
          "grid place-items-center bg-brand text-white font-display italic font-medium leading-none",
          s.box,
        )}
        style={{ letterSpacing: "-0.04em" }}
      >
        S
      </span>
      {showWord && <span className={s.text}>{word}</span>}
    </span>
  );
}
