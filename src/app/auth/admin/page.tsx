"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  ChevronLeft,
  GraduationCap,
  Home,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SystemAdminAuthPage() {
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
      toast.error("Access Denied", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              Sheeksha Tech
            </span>
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <Card className="shadow-lg w-[80%] max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">System Admin</CardTitle>
            </div>
            <CardDescription>
              Authorize to access the network control panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@system.tech"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !data.email || !data.password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4 bg-muted/20">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Restricted Access Area
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
