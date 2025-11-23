"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/types/school";
import axios from "axios";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/helpers";

interface RegisterTabProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  showLoginTab: () => void;
}

export const RegisterTab = ({
  step,
  nextStep,
  prevStep,
  showLoginTab,
}: RegisterTabProps) => {
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      url: "",
      address: "",
      phone: "",
      superAdminName: "",
      superAdminEmail: "",
      superAdminPhone: "",
      superAdminPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure URL has protocol
      const cleanUrl = data.url.trim();
      const finalUrl = cleanUrl.startsWith("http")
        ? cleanUrl
        : `https://${cleanUrl}`;

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/school`, {
        ...data,
        meta: null,
        url: finalUrl,
      });
      toast.success("School registered successfully", {
        description: "You can now log in to your account.",
      });

      showLoginTab();
    } catch (err: any) {
      const message = extractErrorMessage(err);
      form.setError("root", {
        message: err.response?.data?.message || "Registration failed",
      });

      toast.error("Login Failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepFields = {
    1: ["name", "address", "url"] as const,
    2: ["email", "phone"] as const,
    3: [
      "superAdminName",
      "superAdminEmail",
      "superAdminPhone",
      "superAdminPassword",
    ] as const,
  };

  const handleNext = async () => {
    const fields = stepFields[step as keyof typeof stepFields];
    const isValid = await form.trigger(fields);
    if (isValid) nextStep();
  };

  const steps = [
    { title: "Basic Info", icon: "🏫" },
    { title: "Contact", icon: "📧" },
    { title: "Admin Setup", icon: "👨‍🏫" },
  ];

  return (
    <>
      <CardHeader className="text-center pb-4">
        <div className="text-4xl mb-4">🚀</div>
        <CardTitle className="text-2xl">Create Your School Account</CardTitle>
        <CardDescription>
          Step {step} of 3 - {steps[step - 1].title}
        </CardDescription>
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-10 h-2 rounded-full transition ${i <= step ? "bg-chart-2" : "bg-muted"}`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1 - Now with FULL Website URL */}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name 🏫</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Paradise International School"
                          {...field}
                          className="rounded-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address 📍</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Education Street, Mumbai, India"
                          {...field}
                          className="rounded-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Website URL 🌐</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="paradise.edu.in or https://yourschool.com"
                            {...field}
                            className="pl-10 rounded-full"
                            onChange={(e) => {
                              let value = e.target.value.trim();
                              // Optional: auto-prefix https:// for UX
                              if (
                                value &&
                                !value.startsWith("http") &&
                                !value.includes(".")
                              ) {
                                // skip if not domain-like
                              }
                              field.onChange(value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter your official school website (e.g.
                        paradise.edu.in)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Email 📧</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="admin@paradise.edu.in"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone 📞</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="9999999999"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 3 - Admin Setup (unchanged) */}
            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="superAdminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Name 👨‍🏫</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Mr. Om Mishra"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="superAdminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="om@paradise.edu.in"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="superAdminPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="8888888888"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="superAdminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password 🔐</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Input
                            type={showPass ? "text" : "password"}
                            placeholder="Create strong password"
                            {...field}
                            className="pr-12 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full font-medium"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground rounded-full py-6 text-lg font-semibold group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Your School...
                    </>
                  ) : (
                    <>
                      Launch My School! 🎉
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
};
