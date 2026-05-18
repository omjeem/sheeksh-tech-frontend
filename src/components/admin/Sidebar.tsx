"use client";

import {
  CreditCard,
  History,
  LogOut,
  School,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/logo";
import InitialsAvatar from "@/components/common/initials-avatar";

const systemNavItems = [
  { icon: School, label: "Institutions", href: "/admin/schools" },
  { icon: CreditCard, label: "Notification Plans", href: "/admin/plans" },
  { icon: History, label: "Global Ledger", href: "/admin/ledger" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("authToken");
    router.replace("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "sidebar",
          "fixed top-0 left-0 z-50 h-screen w-[248px] transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto",
        )}
      >
        <div className="sb-org">
          <Logo size="md" showWord={false} />
          <div className="min-w-0 flex-1">
            <div className="name truncate">Shiksha Tech</div>
            <div className="role">System Admin</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden grid place-items-center size-7 rounded-md text-ink-3 hover:bg-surface-3"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <div className="sb-section">
          <div className="sb-section-label">Operator console</div>
          {systemNavItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn("sb-item", isActive(href) && "active")}
            >
              <Icon size={17} strokeWidth={1.7} className="ic" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="sb-footer">
          <div className="sb-section mb-1">
            <Link
              href="/admin/settings"
              onClick={onClose}
              className={cn(
                "sb-item",
                isActive("/admin/settings") && "active",
              )}
            >
              <Settings size={17} strokeWidth={1.7} className="ic" />
              <span>Settings</span>
            </Link>
          </div>
          <div className="sb-user">
            <InitialsAvatar name="System Admin" size="md" tone="brand" />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-tight truncate text-ink">
                System Admin
              </div>
              <div className="text-[11px] text-ink-3 truncate">
                admin@shikshatech.org
              </div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="text-ink-3 hover:text-danger transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
