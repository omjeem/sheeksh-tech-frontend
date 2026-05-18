import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[38px] w-full min-w-0 rounded-md border border-border-strong bg-surface px-3 text-[14px] text-ink",
        "placeholder:text-ink-4 selection:bg-brand selection:text-white",
        "outline-none transition-[border-color,box-shadow]",
        "focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[13px] file:font-medium",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/15",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
