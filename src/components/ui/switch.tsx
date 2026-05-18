"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-brand data-[state=unchecked]:bg-border-strong focus-visible:ring-brand/15 inline-flex h-[18px] w-8 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block size-[14px] rounded-full ring-0 transition-transform translate-x-[2px] data-[state=checked]:translate-x-[16px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
