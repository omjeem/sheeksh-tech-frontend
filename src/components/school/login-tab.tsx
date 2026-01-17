"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Mail, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LoginTab = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

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

        toast.success("🎉 Welcome back!", {
          description: "Redirecting to your dashboard...",
        });

        setTimeout(() => {
          router.push("/dashboard/sessions");
        }, 1500);
      }
    } catch (err) {
      const error = err as Error;
      let message = "";

      if (error instanceof AxiosError) {
        message =
          error?.response?.data?.message || error?.response?.data?.error;
      }

      message ??= "Invalid email or password. Please try again.";

      setError(message);
      toast.error("Login Failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="text-center pb-6">
        <div className="text-4xl mb-4">🏫</div>
        <CardTitle className="text-2xl">Welcome Back to Sheeksha!</CardTitle>
        <CardDescription>
          We&apos;re so happy to see you again! Let&apos;s make education
          magical 💕
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">School Email 📧</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@your-school.sheeksha.tech"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="pl-10 rounded-full border-chart-1/30 focus:border-chart-1"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password 🔐</Label>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPass(!showPass)}
                disabled={isLoading}
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="pr-10 rounded-full border-chart-1/30 focus:border-chart-1"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-full text-center border border-destructive/50">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !data.email || !data.password}
            className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground rounded-full py-6 text-lg font-semibold group shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing You In...
              </>
            ) : (
              <>
                Let&apos;s Go! 🚀
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          {/*<div className="text-center text-sm text-muted-foreground">
            Forgot password?{" "}
            <a
              href="/forgot-password"
              className="text-chart-2 hover:underline font-medium"
            >
              Reset here
            </a>
          </div>*/}
        </form>
      </CardContent>
    </>
  );
};
