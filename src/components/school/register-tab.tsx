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
import { PasswordInput } from "@/components/ui/password-input";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/types/school";
import axios from "axios";
import { toast } from "sonner";
import { toDDMMYYYY } from "@/lib/utils";
import { extractErrorMessage } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface RegisterTabProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  showLoginTab: () => void;
}

const STEPS = [
  { title: "School details" },
  { title: "Contact info" },
  { title: "Admin account" },
];

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className={cn(
              "size-5 rounded-full grid place-items-center text-[10px] font-semibold transition-colors",
              i < step && "bg-brand text-white",
              i === step && "bg-brand text-white",
              i > step && "bg-surface-3 text-ink-3",
            )}
          >
            {i}
          </span>
          {i < 3 && (
            <span
              className={cn(
                "w-8 h-px",
                i < step ? "bg-brand" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function IconField({
  icon: Icon,
  ...rest
}: { icon: typeof Mail } & React.ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
      />
      <Input {...rest} className={cn("pl-9", rest.className)} />
    </div>
  );
}

export const RegisterTab = ({
  step,
  nextStep,
  prevStep,
  showLoginTab,
}: RegisterTabProps) => {
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

      toast.success("School registered successfully", {
        description: "You can now sign in with your admin account.",
      });
      showLoginTab();
    } catch (err: any) {
      const message = extractErrorMessage(
        err,
        "Registration failed. Please try again.",
      );
      toast.error("Registration failed", { description: message });
      form.setError("root", { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const fields = (
      {
        1: ["name", "city", "state", "address", "url"],
        2: ["email", "phone"],
        3: [
          "admin.firstName",
          "admin.lastName",
          "admin.email",
          "admin.phone",
          "admin.password",
        ],
      } as Record<number, any>
    )[step];

    const isValid = await form.trigger(fields);
    if (isValid) nextStep();
  };

  return (
    <>
      <p className="eyebrow">Step {step} of 3</p>
      <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] mt-1">
        Create workspace
      </h1>
      <p className="text-ink-3 text-[14px] mt-1">{STEPS[step - 1].title}</p>
      <StepDots step={step} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-7"
        >
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sunrise Global Academy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <IconField
                          icon={MapPin}
                          placeholder="Mumbai"
                          {...field}
                        />
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
                        <IconField
                          icon={Building2}
                          placeholder="Maharashtra"
                          {...field}
                        />
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
                    <FormLabel>Full address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Plot 45, Sector 12, Vashi"
                        {...field}
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
                      <IconField
                        icon={Globe}
                        placeholder="yourschool.edu.in"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-[12px] text-ink-3 mt-1.5">
                      We'll add https:// automatically.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School email</FormLabel>
                    <FormControl>
                      <IconField
                        icon={Mail}
                        type="email"
                        placeholder="info@sunrise.edu.in"
                        {...field}
                      />
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
                    <FormLabel>School phone</FormLabel>
                    <FormControl>
                      <IconField
                        icon={Phone}
                        placeholder="+91 98765 43210"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="admin.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <IconField icon={User} placeholder="Rahul" {...field} />
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
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sharma"
                          {...field}
                          value={field.value ?? ""}
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
                    <FormLabel>Admin email</FormLabel>
                    <FormControl>
                      <IconField
                        icon={Mail}
                        type="email"
                        placeholder="rahul@sunrise.edu.in"
                        {...field}
                      />
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
                    <FormLabel>Admin phone</FormLabel>
                    <FormControl>
                      <IconField
                        icon={Phone}
                        placeholder="+91 98765 43210"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="admin.dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                      />
                    </FormControl>
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
                      <PasswordInput
                        placeholder="Create a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={prevStep}>
                <ChevronLeft size={14} /> Back
              </Button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next <ChevronRight size={14} />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Creating…
                  </>
                ) : (
                  <>
                    Launch school <ArrowRight size={16} />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
