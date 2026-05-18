"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/common/auth-shell";
import Tile from "@/components/common/tile";

export default function SystemAdminAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: data.email.trim(),
          password: data.password,
          isSystemAdmin: true,
        },
      );
      if (response?.data?.data) {
        localStorage.setItem("adminToken", response?.data?.data);
        toast.success("Authentication successful");
        router.push("/admin/schools");
      }
    } catch (err) {
      const error = err as Error;
      let message = "Invalid admin credentials.";
      if (error instanceof AxiosError) {
        message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          message;
      }
      setError(message);
      toast.error("Access denied", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      side="right"
      quote="Operating dozens of schools means seeing every edge case before our customers do. Shiksha Tech gives us the levers without slowing us down."
      quoteName="Network Operations"
      quoteRole="Shiksha Tech · India"
    >
      <div className="flex items-center gap-3 mb-3">
        <Tile tone="brand" icon={ShieldAlert} size={36} />
        <span className="eyebrow">Restricted access</span>
      </div>
      <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em]">
        System Admin
      </h1>
      <p className="text-ink-3 text-[14px] mt-2">
        Authorize to access the network control panel.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
        <div>
          <Label htmlFor="email">Admin email</Label>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
            />
            <Input
              id="email"
              type="email"
              placeholder="admin@shikshatech.org"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="pl-9"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none z-10"
            />
            <PasswordInput
              id="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="pl-9"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="text-[13px] text-danger-ink bg-danger-soft border border-danger/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !data.email || !data.password}
          className="w-full mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Authenticating…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      <p className="text-[11px] text-ink-3 uppercase tracking-[0.08em] font-semibold text-center mt-8">
        Restricted Access Area
      </p>
    </AuthShell>
  );
}
