"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Loader2, Mail, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import LedgerTable from "@/components/billing/LedgerTable";
import PlanStoreCard from "@/components/billing/PlanStoreCard";
import ActivePlanCard from "@/components/billing/ActivePlanCard";
import BillingSkeleton from "@/components/billing/BillingSkeleton";
import billingService from "@/services/billingService";
import { LedgerLog, Plan, PurchasedPlan } from "@/types/billing";
import PageHeader from "@/components/common/page-header";
import SectionCard from "@/components/common/section-card";
import Tile, { type TileTone } from "@/components/common/tile";
import { Plus } from "lucide-react";

export default function BillingPage() {
  const [data, setData] = useState<{
    plans: Plan[];
    purchased: PurchasedPlan[];
    exhaustedPlans: PurchasedPlan[];
    ledger: LedgerLog[];
  }>({ plans: [], purchased: [], exhaustedPlans: [], ledger: [] });
  const [loading, setLoading] = useState(true);

  const [ledgerPage, setLedgerPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreLedger = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = ledgerPage + 1;
      const newLogs = await billingService.getLedger(nextPage, 10);
      if (newLogs.length < 10) setHasMore(false);
      setData((prev) => ({
        ...prev,
        ledger: [...prev.ledger, ...newLogs],
      }));
      setLedgerPage(nextPage);
    } catch (error) {
      console.error("Error loading more ledger logs", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const lastElementRef = (node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) loadMoreLedger();
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plans, purchased, ledger] = await Promise.all([
          billingService.getPlans(),
          billingService.getPurchasedPlans(true),
          billingService.getLedger(1, 10),
        ]);
        const exhaustedPlans = purchased?.filter((plan) => plan.isExhausted);
        const activePlans = purchased?.filter((plan) => !plan.isExhausted);
        setData({ plans, exhaustedPlans, purchased: activePlans, ledger });
      } catch (e) {
        console.error("Failed to load billing data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = data.purchased.reduce(
    (acc, plan) => {
      if (plan?.isExhausted) return acc;
      plan.purchasedChannels.forEach((ch) => {
        if (!acc[ch.channel]) acc[ch.channel] = { total: 0, consumed: 0 };
        acc[ch.channel].total += ch.unitsTotal;
        acc[ch.channel].consumed += ch.unitsConsumed;
      });
      return acc;
    },
    {} as Record<string, { total: number; consumed: number }>,
  );

  if (loading) return <BillingSkeleton />;

  return (
    <>
      <PageHeader
        title="Billing & Usage"
        subtitle="Notification credits, subscription plans, and history."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing" },
        ]}
        actions={
          <Button size="sm">
            <Plus size={14} /> Buy credits
          </Button>
        }
      />

      {/* Credits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuotaSummaryCard
          title="Email credits"
          consumed={stats.EMAIL?.consumed || 0}
          total={stats.EMAIL?.total || 0}
          icon={Mail}
          tone="brand"
        />
        <QuotaSummaryCard
          title="SMS credits"
          consumed={stats.SMS?.consumed || 0}
          total={stats.SMS?.total || 0}
          icon={MessageSquare}
          tone="teal"
        />
      </div>

      <Tabs defaultValue="usage" className="mt-6">
        <TabsList variant="underline">
          <TabsTrigger value="usage">My plans</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="expired">Expired plans</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          {data.purchased.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-10 text-center">
              <p className="text-ink-3 text-[14px]">
                No active plans. Visit the store to purchase one.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.purchased.map((p) => (
                <ActivePlanCard key={p.id} plan={p} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {data.exhaustedPlans.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-10 text-center">
              <p className="text-ink-3 text-[14px]">No expired plans.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.exhaustedPlans.map((p) => (
                <ActivePlanCard key={p.id} plan={p} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.plans.map((p) => (
              <PlanStoreCard key={p.id} plan={p} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <SectionCard
            title="Ledger logs"
            subtitle="Real-time audit of credit usage and top-ups."
            noPadding
          >
            <LedgerTable data={data.ledger} />
            <div ref={lastElementRef} className="py-4 flex justify-center">
              {isFetchingMore && (
                <div className="flex items-center gap-2 text-[13px] text-ink-3">
                  <Loader2 size={14} className="animate-spin" /> Loading more…
                </div>
              )}
              {!hasMore && data.ledger.length > 0 && (
                <p className="text-[12px] text-ink-3">No more logs to show.</p>
              )}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </>
  );
}

function QuotaSummaryCard({
  title,
  consumed,
  total,
  icon,
  tone,
}: {
  title: string;
  consumed: number;
  total: number;
  icon: typeof Mail;
  tone: TileTone;
}) {
  const percentage = total > 0 ? (consumed / total) * 100 : 0;
  const remaining = Math.max(0, total - consumed);
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Tile tone={tone} icon={icon} size={36} />
          <span className="text-[15px] font-semibold">{title}</span>
        </div>
        <Button size="xs" variant="ghost">
          Top up <ArrowUpRight size={12} />
        </Button>
      </div>
      <div className="flex items-baseline gap-2 mt-4">
        <span className="text-[28px] font-semibold tracking-tight tnum">
          {remaining.toLocaleString()}
        </span>
        <span className="text-[13px] text-ink-3">
          of {total.toLocaleString()} remaining
        </span>
      </div>
      <Progress
        value={Math.max(0, 100 - percentage)}
        tone={percentage > 80 ? "danger" : percentage > 50 ? "warning" : "brand"}
        className="mt-2"
      />
      <div className="flex justify-between mt-2.5 text-[12px] text-ink-3">
        <span>{Math.max(0, 100 - percentage).toFixed(0)}% available</span>
        <span>{consumed.toLocaleString()} used</span>
      </div>
    </div>
  );
}
