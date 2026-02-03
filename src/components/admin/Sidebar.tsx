"use client";

import { Button } from "@/components/ui/button";
import LogoutBtn from "@/components/logout-btn";
import {
  LayoutDashboard,
  School,
  ShieldAlert,
  CreditCard,
  Activity,
  UserCog,
  History,
  Lock,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const systemNavItems = [
  // { icon: LayoutDashboard, label: "System Overview", href: "/admin/system" },
  { icon: School, label: "Manage Schools", href: "/admin/schools" },
  {
    icon: CreditCard,
    label: "Notification Plans",
    href: "/admin/plans",
  },
  // { icon: Activity, label: "Usage Limits", href: "/admin/system/limits" },
  { icon: History, label: "Global Ledger", href: "/admin/ledger" },
  // { icon: UserCog, label: "System Admins", href: "/admin/system/users" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-card border-r border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex-1">
            {/* Header / Brand */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight">
                    Sheeksha
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-semibold">
                    System Administrator
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="lg:hidden">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {systemNavItems.map(({ icon: Icon, label, href }) => {
                const isActive = pathname === href;
                return (
                  <Button
                    key={href}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start rounded-lg transition-all",
                      isActive && "bg-secondary font-medium",
                    )}
                    asChild
                    onClick={onClose}
                  >
                    <Link href={href}>
                      <Icon
                        className={cn(
                          "w-4 h-4 mr-3",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      {label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Account/Security Footer */}
          {/*<div className="px-6 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              asChild
              onClick={onClose}
            >
              <Link href="/admin/system/profile">
                <Lock className="w-4 h-4 mr-3" />
                System Security
              </Link>
            </Button>
          </div>*/}

          {/* Logout Section */}
          <div className="p-6 border-t border-border/50">
            <LogoutBtn />
          </div>
        </div>
      </aside>
    </>
  );
}
