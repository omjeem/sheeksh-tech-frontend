// app/(system-admin)/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.replace("/");
    }
  }, []);

  return (
    <div className="flex min-h-screen h-screen bg-background overflow-hidden">
      {/* Sidebar with props fixed */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 border-b flex items-center justify-between px-6 bg-card">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Super Admin Panel
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/*User Profile dropdown  */}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-lg:h-[calc(100vh-2rem)] h-full overflow-hidden">
          <Card className="h-full">{children}</Card>
        </main>
      </div>
    </div>
  );
}
