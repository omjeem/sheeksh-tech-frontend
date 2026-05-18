"use client";

import Link from "next/link";
import Logo from "@/components/common/logo";
import InitialsAvatar from "@/components/common/initials-avatar";
import { ArrowUpRight } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  side?: "left" | "right";
  quote?: string;
  quoteName?: string;
  quoteRole?: string;
  footer?: React.ReactNode;
  homeHref?: string;
  rightHeader?: React.ReactNode;
}

export default function AuthShell({
  children,
  side = "right",
  quote = "Fee collection used to be a week's work. Now it's an afternoon. The teachers were the surprise — they actually like the attendance flow.",
  quoteName = "Mrs. Meera Singh",
  quoteRole = "Principal · Rainbow Kids School",
  homeHref = "/",
  rightHeader,
}: AuthShellProps) {
  const marketing = (
    <div className="relative hidden lg:flex flex-col justify-between bg-ink text-white p-12 xl:p-14 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 70% 80% at 70% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 70% 30%, black 30%, transparent 75%)",
        }}
      />
      <Logo size="md" invert />
      <div className="relative">
        <p className="serif italic text-[26px] xl:text-[32px] leading-[1.3] tracking-tight">
          "{quote}"
        </p>
        <div className="flex items-center gap-3 mt-7">
          <InitialsAvatar
            name={quoteName}
            size="lg"
            className="bg-white text-brand"
          />
          <div>
            <div className="font-semibold">{quoteName}</div>
            <div className="text-[oklch(0.78_0.01_80)] text-[13px]">
              {quoteRole}
            </div>
          </div>
        </div>
      </div>
      <div className="relative text-[12px] text-[oklch(0.7_0.01_80)]">
        Trusted by 500+ schools across India
      </div>
    </div>
  );

  const form = (
    <div className="flex flex-col bg-surface min-h-screen lg:min-h-0">
      <div className="flex items-center justify-between p-5 sm:p-6 lg:p-8">
        <Link
          href={homeHref}
          className="text-[13px] text-ink-3 inline-flex items-center gap-1.5 hover:text-ink transition-colors"
        >
          <ArrowUpRight size={13} className="rotate-[225deg]" />
          Back to home
        </Link>
        {rightHeader && <div>{rightHeader}</div>}
      </div>
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-10 pb-10">
        <div className="w-full max-w-[400px] mx-auto">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-2 lg:min-h-screen bg-surface">
      {side === "left" ? (
        <>
          {form}
          {marketing}
        </>
      ) : (
        <>
          {marketing}
          {form}
        </>
      )}
    </div>
  );
}
