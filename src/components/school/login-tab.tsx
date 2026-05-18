"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LoginTab = () => {
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
          isSuperAdmin: true,
        },
      );

      if (response?.data?.data) {
        localStorage.setItem("authToken", response?.data?.data);
        toast.success("Welcome back", {
          description: "Redirecting to your dashboard…",
        });
        setTimeout(() => {
          router.push("/dashboard/sessions");
        }, 1200);
      }
    } catch (err) {
      const error = err as Error;
      let message = "";
      if (error instanceof AxiosError) {
        message =
          error?.response?.data?.message || error?.response?.data?.error;
      }
      message ||= "Invalid email or password. Please try again.";
      setError(message);
      toast.error("Login failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em]">
        Welcome back
      </h1>
      <p className="text-ink-3 text-[14px] mt-2">
        Sign in to your school's workspace.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
        <div>
          <Label htmlFor="email">School email</Label>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
            />
            <Input
              id="email"
              type="email"
              placeholder="admin@your-school.edu"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="pl-9"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password" className="mb-0">
              Password
            </Label>
            <a className="text-[12px] text-brand cursor-pointer hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none z-10"
            />
            <PasswordInput
              id="password"
              placeholder="Enter your password"
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
              <Loader2 className="size-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      <p className="text-[12px] text-ink-3 text-center mt-6">
        By signing in you agree to our{" "}
        <span className="text-ink-2 underline">Terms</span> and{" "}
        <span className="text-ink-2 underline">Privacy</span>.
      </p>
    </>
  );
};
