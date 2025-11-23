// components/dashboard/Sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import LogoutBtn from "@/components/logout-btn";
import {
  BookCopy,
  BookOpen,
  Calendar,
  LayoutDashboard,
  School,
  Users,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  // { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Sessions", href: "/dashboard/sessions" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: Users, label: "Students", href: "/dashboard/students" },
  { icon: Users, label: "Teachers", href: "/dashboard/teachers" },
  { icon: BookCopy, label: "Subjects", href: "/dashboard/subjects" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-card/90 backdrop-blur-md border-r border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex-1">
            {/* Logo & Title */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                  <School className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                  Sheeksha Admin
                </span>
              </div>
              {/* Close button - mobile only */}
              <button onClick={onClose} className="lg:hidden">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map(({ icon: Icon, label, href }) => (
                <Button
                  key={href}
                  variant="ghost"
                  className="w-full justify-start text-left text-foreground hover:bg-chart-1/10 rounded-lg"
                  asChild
                  onClick={onClose} // Close sidebar on mobile when clicking a link
                >
                  <Link href={href}>
                    <Icon className="w-4 h-4 mr-3" />
                    {label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          {/* Logout Button at Bottom */}
          <div className="p-6 border-t border-border/50">
            <LogoutBtn />
          </div>
        </div>
      </aside>
    </>
  );
}
