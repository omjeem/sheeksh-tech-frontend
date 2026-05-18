"use client";

import {
  Bell,
  BookCopy,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  LogOut,
  Settings,
  User,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/logo";
import InitialsAvatar from "@/components/common/initials-avatar";
import { decodeJWT } from "@/lib/utils";
import { useEffect, useState } from "react";

type NavItem = {
  icon: typeof Calendar;
  label: string;
  href: string;
  count?: string;
};

const workspaceNav: NavItem[] = [
  { icon: Calendar, label: "Sessions", href: "/dashboard/sessions" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: GraduationCap, label: "Students", href: "/dashboard/students" },
  { icon: User, label: "Teachers", href: "/dashboard/teachers" },
  { icon: UserCog, label: "Guardians", href: "/dashboard/guardians" },
  { icon: BookCopy, label: "Subjects", href: "/dashboard/subjects" },
];

const communicationsNav: NavItem[] = [
  { icon: FileText, label: "Templates", href: "/dashboard/templates" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SessionInfo {
  name: string;
  email: string;
  role: string;
}

function useSession(): SessionInfo {
  const [info, setInfo] = useState<SessionInfo>({
    name: "School Admin",
    email: "",
    role: "School Admin",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("adminToken");
    if (!token) return;
    const decoded = decodeJWT(token);
    if (!decoded) return;
    const isAdmin = !!localStorage.getItem("adminToken");
    setInfo({
      name: decoded.name || decoded.firstName || decoded.email || "Account",
      email: decoded.email || "",
      role: isAdmin ? "System Admin" : decoded.role || "School Admin",
    });
  }, []);

  return info;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminToken");
    router.replace("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[248px] transform transition-transform duration-300 ease-out lg:translate-x-0 lg:sticky lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "sidebar",
        )}
      >
        {/* Org */}
        <div className="sb-org">
          <Logo size="md" showWord={false} />
          <div className="min-w-0 flex-1">
            <div className="name truncate">Shiksha Tech</div>
            <div className="role">{session.role}</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden grid place-items-center size-7 rounded-md text-ink-3 hover:bg-surface-3"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Workspace */}
        <div className="sb-section">
          <div className="sb-section-label">Workspace</div>
          {workspaceNav.map(({ icon: Icon, label, href }) => (
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

        {/* Communications */}
        <div className="sb-section">
          <div className="sb-section-label">Communications</div>
          {communicationsNav.map(({ icon: Icon, label, href, count }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn("sb-item", isActive(href) && "active")}
            >
              <Icon size={17} strokeWidth={1.7} className="ic" />
              <span>{label}</span>
              {count && <span className="count">{count}</span>}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="sb-footer">
          <div className="sb-section mb-1">
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className={cn(
                "sb-item",
                isActive("/dashboard/profile") && "active",
              )}
            >
              <Settings size={17} strokeWidth={1.7} className="ic" />
              <span>Settings</span>
            </Link>
          </div>
          <div className="sb-user group">
            <InitialsAvatar
              name={session.name}
              size="md"
              tone="brand"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-tight truncate text-ink">
                {session.name}
              </div>
              {session.email && (
                <div className="text-[11px] text-ink-3 truncate">
                  {session.email}
                </div>
              )}
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

export { workspaceNav, communicationsNav };
