"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted on client

  useEffect(() => {
    setIsMounted(true); // Now we're on the client

    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // Don't render auth-sensitive content until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                Sheeksha Tech
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
              >
                Stories
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
              >
                Contact
              </Link>
            </nav>
            {/* Show placeholder or nothing while mounting */}
            <div className="w-48" /> {/* Optional: keep layout stable */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              Sheeksha Tech
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
            >
              Stories
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {isLoggedIn ? (
            <Link
              href="/dashboard/sessions"
              className="text-primary font-semibold hover:underline"
            >
              Dashboard
            </Link>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="cursor-pointer">
                    Step Into Sheeksha
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-44 p-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/auth/school"
                        className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>As School</span>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/auth/parent" // Fixed: was "#" before
                        className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        <span>As Parent</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      </div>
    </header>
  );
}
