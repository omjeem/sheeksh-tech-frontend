import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-brand/15 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-white hover:bg-brand-hover",
        destructive:
          "bg-danger text-white hover:brightness-95",
        outline:
          "border border-border-strong bg-surface text-ink hover:bg-surface-2",
        secondary:
          "border border-border-strong bg-surface text-ink hover:bg-surface-2",
        ghost:
          "text-ink hover:bg-surface-2",
        soft:
          "bg-brand-soft text-brand-ink hover:bg-brand-soft-2",
        "danger-soft":
          "bg-danger-soft text-danger-ink hover:brightness-95",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 text-[14px] has-[>svg]:px-3",
        sm: "h-8 px-2.5 text-[13px] has-[>svg]:px-2",
        xs: "h-[26px] rounded-sm px-2 text-[12px] has-[>svg]:px-1.5 gap-1",
        lg: "h-[42px] px-4.5 text-[16px] has-[>svg]:px-4 gap-2",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-[26px] rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
