import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border border-border-strong bg-surface text-ink placeholder:text-ink-4 aria-invalid:border-danger flex min-h-20 w-full rounded-md px-3 py-2.5 text-[14px] transition-[border-color,box-shadow] outline-none resize-vertical focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
