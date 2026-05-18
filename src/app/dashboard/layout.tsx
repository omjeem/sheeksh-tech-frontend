"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Logo from "@/components/common/logo";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage?.getItem("authToken");
    if (!token) router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="app-shell">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-col min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-surface/85 backdrop-blur border-b border-border">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid place-items-center size-9 rounded-md hover:bg-surface-2 text-ink"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <Logo size="md" />
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
