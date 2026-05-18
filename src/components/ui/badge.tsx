import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[6px] border px-2 h-[22px] text-[12px] font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none [&>svg]:size-3 transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border bg-surface-3 text-ink-2",
        secondary:
          "border-border bg-surface-2 text-ink-2",
        outline:
          "border-border-strong bg-transparent text-ink-2",
        brand:
          "border-transparent bg-brand-soft text-brand-ink",
        teal:
          "border-transparent bg-teal-soft text-teal-ink",
        success:
          "border-transparent bg-success-soft text-success-ink",
        warning:
          "border-transparent bg-warning-soft text-warning-ink",
        danger:
          "border-transparent bg-danger-soft text-danger-ink",
        destructive:
          "border-transparent bg-danger-soft text-danger-ink",
        info:
          "border-transparent bg-info-soft text-info-ink",
      },
      size: {
        sm: "h-[18px] px-1.5 text-[10.5px]",
        md: "",
        lg: "h-[26px] px-2.5 text-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  dot?: boolean;
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  dot,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className="inline-block size-[6px] rounded-full bg-current opacity-85"
        />
      )}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
