"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminToken");
    router.replace("/");
  };

  return (
    <Button
      variant="outline"
      className="rounded-full text-destructive hover:bg-destructive/10"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
