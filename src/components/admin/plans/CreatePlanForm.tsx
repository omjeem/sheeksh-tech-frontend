"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Important: Wrap schema in this
import * as z from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Trash2, PlusCircle, AlertCircle } from "lucide-react";

const planSchema = z.object({
  key: z.string().min(3, "Key must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  planType: z.enum(["PUBLIC", "CUSTOM"]),
  basePrice: z.coerce.number().min(0),
  currency: z.string().default("INR"),
  features: z
    .array(
      z.object({
        channel: z.enum(["EMAIL", "SMS"]),
        units: z.coerce.number().min(1, "Units must be at least 1"),
      }),
    )
    .nonempty("At least one feature is required")
    .max(2, "Maximum 2 channels allowed")
    .refine(
      (features) => {
        const channels = features.map((f) => f.channel);
        return new Set(channels).size === channels.length;
      },
      { message: "Duplicate channels are not allowed" },
    ),
});

type PlanFormValues = z.infer<typeof planSchema>;

export function CreatePlanForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema), // FIXED: Wrapped in zodResolver
    defaultValues: {
      currency: "INR",
      planType: "PUBLIC",
      features: [{ channel: "SMS", units: 1000 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  // UX Logic: Check which channels are already selected
  const selectedChannels = fields.map((f) => f.channel);
  const canAddMore = fields.length < 2;

  const onSubmit = async (values: PlanFormValues) => {
    try {
      await adminService.createNotificationPlan(values);
      toast.success("Plan created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create plan");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enterprise Gold" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Key</FormLabel>
                <FormControl>
                  <Input placeholder="ent-gold-v1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="High volume plan for large schools"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="planType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              Quota Configuration
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {fields.length}/2
              </span>
            </h4>
            {canAddMore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() => {
                  const nextChannel = selectedChannels.includes("SMS")
                    ? "EMAIL"
                    : "SMS";
                  append({ channel: nextChannel, units: 1000 });
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" /> Add Channel
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group relative flex gap-3 items-end bg-muted/30 p-4 rounded-xl border border-transparent hover:border-border transition-all"
              >
                <FormField
                  control={form.control}
                  name={`features.${index}.channel`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                        Channel
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* UX: Disable options already picked in other fields */}
                          <SelectItem
                            value="EMAIL"
                            disabled={
                              selectedChannels.includes("EMAIL") &&
                              field.value !== "EMAIL"
                            }
                          >
                            Email
                          </SelectItem>
                          <SelectItem
                            value="SMS"
                            disabled={
                              selectedChannels.includes("SMS") &&
                              field.value !== "SMS"
                            }
                          >
                            SMS
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`features.${index}.units`}
                  render={({ field }) => (
                    <FormItem className="flex-[1.5]">
                      <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                        Monthly Units
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {form.formState.errors.features?.root && (
            <p className="text-[0.8rem] font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />{" "}
              {form.formState.errors.features.root.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20"
        >
          Create Notification Plan
        </Button>
      </form>
    </Form>
  );
}
