"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { decodeJWT } from "@/lib/utils";
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
    const token = localStorage.getItem("authToken");

    console.log("decodeJWT", decodeJWT(token));
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Hamburger */}
        <header className="lg:hidden bg-card/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-4 text-lg font-semibold">Sheeksha Admin</span>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-lg:h-[calc(100vh-2rem)] h-full overflow-hidden">
          <Card className="shadow-2xl border-2 border-chart-1/20 bg-card/80 backdrop-blur-sm p-6 h-full">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}
