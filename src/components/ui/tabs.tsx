"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

/**
 * Variant: "pill" (default) or "underline"
 */
function TabsList({
  className,
  variant = "pill",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "pill" | "underline";
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        variant === "pill"
          ? "inline-flex items-center gap-1 rounded-md bg-surface-3 p-1 w-fit"
          : "inline-flex items-center gap-0 border-b border-border w-full",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Common
        "inline-flex items-center justify-center gap-1.5 font-medium whitespace-nowrap text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/15 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Pill variant (default)
        "data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-xs",
        "rounded-sm px-3 py-1.5 text-[13px]",
        // Underline variant overrides via parent[data-variant=underline]
        "[[data-variant=underline]_&]:rounded-none [[data-variant=underline]_&]:bg-transparent [[data-variant=underline]_&]:shadow-none [[data-variant=underline]_&]:px-3.5 [[data-variant=underline]_&]:py-2.5 [[data-variant=underline]_&]:text-[14px] [[data-variant=underline]_&]:border-b-2 [[data-variant=underline]_&]:border-transparent [[data-variant=underline]_&]:-mb-px [[data-variant=underline]_&]:text-ink-3",
        "[[data-variant=underline]_&]:data-[state=active]:border-brand [[data-variant=underline]_&]:data-[state=active]:text-brand [[data-variant=underline]_&]:data-[state=active]:bg-transparent [[data-variant=underline]_&]:data-[state=active]:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
