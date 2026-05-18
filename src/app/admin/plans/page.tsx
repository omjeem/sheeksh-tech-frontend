"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { CreatePlanForm } from "@/components/admin/plans/CreatePlanForm";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface Plan {
  id: string;
  name: string;
  description?: string;
  planType: string;
  basePrice: number;
  currency: string;
  features?: { channel: string; units: number }[];
}

export default function NotificationPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getNotificationPlans();
      setPlans(response || []);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSuccess = () => {
    setIsOpen(false);
    fetchPlans();
  };

  return (
    <>
      <PageHeader
        title="Notification Plans"
        subtitle="Manage credits and billing tiers for schools."
        breadcrumb={[
          { label: "System", href: "/admin/schools" },
          { label: "Plans" },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
            >
              <RefreshCw
                size={14}
                className={isLoading ? "animate-spin" : ""}
              />{" "}
              Refresh
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus size={14} /> New plan
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Create notification plan</SheetTitle>
                  <SheetDescription>
                    Define a new pricing tier. Keys must be unique (e.g.
                    "starter-v1").
                  </SheetDescription>
                </SheetHeader>
                <CreatePlanForm onSuccess={handleSuccess} />
              </SheetContent>
            </Sheet>
          </>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[260px] rounded-xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon={CreditCard}
            title="No plans created yet"
            description="Create a plan to start assigning credits to schools."
            action={
              <Button size="sm" onClick={() => setIsOpen(true)}>
                <Plus size={14} /> New plan
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-surface border border-border rounded-xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <Badge
                  variant={plan.planType === "PUBLIC" ? "brand" : "outline"}
                  className="capitalize"
                >
                  {plan.planType.toLowerCase()}
                </Badge>
                <div className="text-right">
                  <div className="eyebrow text-[10px]">Base price</div>
                  <div className="text-[18px] font-semibold tracking-tight tnum">
                    {plan.currency} {plan.basePrice.toLocaleString()}
                  </div>
                </div>
              </div>
              <h3 className="text-[18px] font-semibold mt-3 tracking-tight">
                {plan.name}
              </h3>
              <p className="text-[13px] text-ink-3 mt-1 line-clamp-2 min-h-[36px]">
                {plan.description}
              </p>
              <div className="mt-4 p-3 bg-bg-2 border border-border rounded-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3 mb-2">
                  Allowances
                </p>
                <div className="flex flex-col gap-1.5">
                  {plan.features?.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <div className="flex items-center gap-2 text-ink-2">
                        {f.channel === "EMAIL" ? (
                          <Mail size={13} />
                        ) : (
                          <MessageSquare size={13} />
                        )}
                        <span>{f.channel}</span>
                      </div>
                      <span className="mono font-semibold tnum">
                        {f.units.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" className="flex-1">
                  Archive
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
