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
  MapPin,
  Building2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/types/school";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn, toDDMMYYYY } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
      phone: "",
      url: "",
      city: "",
      state: "",
      address: "",
      admin: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        dateOfBirth: undefined,
      },
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const cleanUrl = data.url.trim();
      const finalUrl = cleanUrl.startsWith("http")
        ? cleanUrl
        : `https://${cleanUrl}`;

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/school`, {
        ...data,
        admin: {
          ...data.admin,
          dateOfBirth: data.admin.dateOfBirth
            ? toDDMMYYYY(new Date(data.admin.dateOfBirth))
            : undefined,
        },
        url: finalUrl,
        meta: null,
      });

      toast.success("School registered successfully!", {
        description: "You can now log in with your admin account.",
      });
      showLoginTab();
    } catch (err: any) {
      const message = extractErrorMessage(
        err,
        "Registration failed. Please try again.",
      );
      toast.error("Registration Failed", { description: message });
      form.setError("root", { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const fields = {
      1: ["name", "city", "state", "address", "url"],
      2: ["email", "phone"],
      3: [
        "admin.firstName",
        "admin.lastName",
        "admin.email",
        "admin.phone",
        "admin.password",
      ],
    }[step];

    const isValid = await form.trigger(fields);
    if (isValid) nextStep();
  };

  const steps = [
    { title: "School Details", icon: "School" },
    { title: "Contact Info", icon: "Contact" },
    { title: "Admin Account", icon: "Admin" },
  ];

  return (
    <>
      <CardHeader className="text-center pb-4">
        <div className="text-4xl mb-4">Rocket</div>
        <CardTitle className="text-2xl">Create Your School Account</CardTitle>
        <CardDescription>
          Step {step} of 3 - {steps[step - 1].title}
        </CardDescription>
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-10 h-2 rounded-full transition ${
                i <= step ? "bg-chart-2" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: School Details */}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sunrise Global Academy"
                          {...field}
                          className="rounded-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Mumbai"
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
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Maharashtra"
                              {...field}
                              className="pl-10 rounded-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Plot 45, Sector 12, Vashi"
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
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="yourschool.edu.in"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        We’ll add https:// automatically
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="info@sunrise.edu.in"
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
                      <FormLabel>School Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+91 98765 43210"
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

            {/* Step 3: Admin Account */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="admin.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Rahul"
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
                    name="admin.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sharma"
                            {...field}
                            value={field.value ?? ""}
                            className="rounded-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="admin.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="rahul@sunrise.edu.in"
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
                  name="admin.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+91 98765 43210"
                            {...field}
                            className="pl-10 rounded-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional Date of Birth */}
                <FormField
                  control={form.control}
                  name="admin.dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth (Optional)</FormLabel>
                      <Input
                        type="date"
                        {...field}
                        className="pl-10 rounded-full"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin.password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
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
                            placeholder="Create a strong password"
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
            <div className="flex justify-between pt-8">
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
                  className="ml-auto bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full font-medium px-8"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground rounded-full py-6 px-10 text-lg font-semibold group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating School...
                    </>
                  ) : (
                    <>
                      Launch My School!{" "}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
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
