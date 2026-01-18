"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, MessageSquare, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import LedgerTable from "@/components/billing/LedgerTable";
import PlanStoreCard from "@/components/billing/PlanStoreCard";
import ActivePlanCard from "@/components/billing/ActivePlanCard";
import BillingSkeleton from "@/components/billing/BillingSkeleton";
import billingService from "@/services/billingService";
import { LedgerLog, Plan, PurchasedPlan } from "@/types/billing";

export default function BillingPage() {
  const [data, setData] = useState<{
    plans: Plan[];
    purchased: PurchasedPlan[];
    ledger: LedgerLog[];
  }>({ plans: [], purchased: [], ledger: [] });
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

      if (newLogs.length < 10) {
        setHasMore(false);
      }

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
      if (entries[0].isIntersecting && hasMore) {
        loadMoreLedger();
      }
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
        setData({ plans, purchased, ledger });
      } catch (e) {
        console.error("Failed to load billing data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = data.purchased.reduce((acc, plan) => {
    plan.purchasedChannels.forEach((ch) => {
      if (!acc[ch.channel]) acc[ch.channel] = { total: 0, consumed: 0 };
      acc[ch.channel].total += ch.unitsTotal;
      acc[ch.channel].consumed += ch.unitsConsumed;
    });
    return acc;
  }, {} as any);

  if (loading) return <BillingSkeleton />;

  return (
    <div className="flex-1 space-y-8 flex flex-col overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing & Usage</h2>
          <p className="text-muted-foreground font-medium">
            Manage your notification credits and subscription history.
          </p>
        </div>
        {/*<div className="flex items-center space-x-2">
          <Card className="flex items-center gap-4 px-4 py-2 bg-primary/5 border-primary/20 shadow-none">
            <Wallet className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                Estimated Balance
              </p>
              <p className="text-sm font-bold">
                ₹{" "}
                {(stats.SMS?.total || 0) * 0.2 +
                  (stats.EMAIL?.total || 0) * 0.05}
              </p>
            </div>
          </Card>
        </div>*/}
      </div>

      {/* GLOBAL QUOTA OVERVIEW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuotaSummaryCard
          title="Email Credits"
          consumed={stats.EMAIL?.consumed || 0}
          total={stats.EMAIL?.total || 0}
          icon={Mail}
          color="text-blue-500"
        />
        <QuotaSummaryCard
          title="SMS Credits"
          consumed={stats.SMS?.consumed || 0}
          total={stats.SMS?.total || 0}
          icon={MessageSquare}
          color="text-orange-500"
        />
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="usage">My Plans</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.purchased.map((p) => (
              <ActivePlanCard key={p.id} plan={p} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.plans.map((p) => (
              <PlanStoreCard key={p.id} plan={p} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Ledger Logs</CardTitle>
              <CardDescription>
                Real-time audit of credit usage and top-ups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LedgerTable data={data.ledger} />
              <div ref={lastElementRef} className="py-4 flex justify-center">
                {isFetchingMore && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading more...
                  </div>
                )}
                {!hasMore && data.ledger.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    No more logs to show.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuotaSummaryCard({
  title,
  consumed,
  total,
  icon: Icon,
  color,
}: {
  title: string;
  consumed: number;
  total: number;
  icon: any;
  color: string;
}) {
  const percentage = total > 0 ? (consumed / total) * 100 : 0;
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {consumed.toLocaleString()} / {total.toLocaleString()}
        </div>
        <Progress value={percentage} className="h-2 mt-3" />
        <p className="text-xs text-muted-foreground mt-2">
          {percentage.toFixed(1)}% of total credits used
        </p>
      </CardContent>
    </Card>
  );
}
