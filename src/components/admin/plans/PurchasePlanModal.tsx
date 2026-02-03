"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, School, Zap, Loader2 } from "lucide-react";

interface PurchasePlanModalProps {
  school: { id: string; name: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchasePlanModal({
  school,
  isOpen,
  onClose,
}: PurchasePlanModalProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchPlans = async () => {
        setIsLoadingPlans(true);
        try {
          const res = await adminService.getNotificationPlans();
          setPlans(res || []);
        } catch (err) {
          toast.error("Failed to load available plans");
        } finally {
          setIsLoadingPlans(false);
        }
      };
      fetchPlans();
    }
  }, [isOpen]);

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    setSelectedPlanId(planId);
    setNegotiatedPrice(plan?.basePrice || 0);
  };

  const handlePurchase = async () => {
    if (!school?.id || !selectedPlanId) return;

    setIsSubmitting(true);
    try {
      await adminService.purchasePlanForSchool({
        schoolId: school.id,
        planId: selectedPlanId,
        price: negotiatedPrice,
      });
      toast.success(`Plan successfully assigned to ${school.name}`);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Purchase Notification Plan
          </DialogTitle>
          <DialogDescription>
            Assign a billing tier to{" "}
            <span className="font-semibold text-foreground">
              {school?.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Select Plan</Label>
            <Select onValueChange={handlePlanChange} value={selectedPlanId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingPlans ? "Loading plans..." : "Choose a plan"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} ({plan.currency} {plan.basePrice})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Final Price (
              {plans.find((p) => p.id === selectedPlanId)?.currency || "INR"})
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                value={negotiatedPrice}
                onChange={(e) => setNegotiatedPrice(Number(e.target.value))}
                className="pl-8"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">
                {plans.find((p) => p.id === selectedPlanId)?.currency === "USD"
                  ? "$"
                  : "₹"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * You can override the base price for custom school deals.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handlePurchase}
            disabled={!selectedPlanId || isSubmitting}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Confirm Purchase
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
