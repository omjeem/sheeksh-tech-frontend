"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { CreatePlanForm } from "@/components/admin/plans/CreatePlanForm";

export default function NotificationPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getNotificationPlans();
      setPlans(response || []);
    } catch (error) {
      toast.error("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // This callback is passed to the form to close the modal and refresh data
  const handleSuccess = () => {
    setIsOpen(false);
    fetchPlans();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden gap-6 px-3 md:px-6">
      <div className="flex justify-between flex-col md:flex-row gap-3 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notification Plans
          </h1>
          <p className="text-muted-foreground">
            Manage credits and billing tiers for schools.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPlans}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create New Plan
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Create Notification Plan</SheetTitle>
                <SheetDescription>
                  Define a new pricing tier. Keys must be unique (e.g.,
                  "starter-v1").
                </SheetDescription>
              </SheetHeader>
              {/* Passing the success handler to the form */}
              <CreatePlanForm onSuccess={handleSuccess} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
          </div>
        ) : plans.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 border-dashed">
            <Zap className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">No plans created yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={
                        plan.planType === "PUBLIC" ? "default" : "outline"
                      }
                      className="capitalize"
                    >
                      {plan.planType.toLowerCase()}
                    </Badge>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block uppercase font-bold tracking-tighter">
                        Base Price
                      </span>
                      <span className="text-xl font-bold">
                        {plan.currency} {plan.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-xl">{plan.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                      Allowances
                    </p>
                    {plan.features?.map((f: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {f.channel === "EMAIL" ? (
                            <Mail className="h-3 w-3" />
                          ) : (
                            <MessageSquare className="h-3 w-3" />
                          )}
                          <span>{f.channel}</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">
                          {f.units.toLocaleString()}{" "}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            UNITS
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="w-full text-xs h-8">
                      Archive
                    </Button>
                    <Button variant="outline" className="w-full text-xs h-8">
                      Edit Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
