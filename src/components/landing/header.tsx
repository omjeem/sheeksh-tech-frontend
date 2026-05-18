"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, GraduationCap, Menu, Shield, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Stories", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function LandingHeader() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const adminToken = localStorage.getItem("adminToken");
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token || !!adminToken);
    setIsAdmin(!!adminToken);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur border-b border-border">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[14px] text-ink-2 hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {mounted && isLoggedIn ? (
              <Button asChild size="sm">
                <Link href={isAdmin ? "/admin/schools" : "/dashboard/sessions"}>
                  Open dashboard
                </Link>
              </Button>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Sign in <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem asChild>
                      <Link href="/auth/school" className="cursor-pointer">
                        <GraduationCap size={16} /> As School
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/admin" className="cursor-pointer">
                        <Shield size={16} /> As System Admin
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild size="sm">
                  <Link href="/auth/school">Start free trial</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden grid place-items-center size-9 rounded-md hover:bg-surface-2 text-ink"
            aria-label="Open menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-divider flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-[14px] text-ink-2 hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {mounted && isLoggedIn ? (
                <Button asChild>
                  <Link href={isAdmin ? "/admin/schools" : "/dashboard/sessions"}>
                    Open dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="secondary" asChild>
                    <Link href="/auth/school">Sign in as School</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/admin">Sign in as Admin</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
