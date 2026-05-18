"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { adminService } from "@/services/adminService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Loader2,
  Mail,
  MessageSquare,
  Search,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface LedgerEntry {
  id: string;
  createdAt: string;
  operation: string;
  creditsUsed: number;
  school: { name: string; url?: string };
  planInstance: { name: string; key?: string };
  channel?: { channel?: string };
}

export default function NotificationLedger() {
  const [logs, setLogs] = useState<LedgerEntry[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [opFilter, setOpFilter] = useState("ALL");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.planInstance.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesOp = opFilter === "ALL" || log.operation === opFilter;
      return matchesSearch && matchesOp;
    });
  }, [logs, searchQuery, opFilter]);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getLedger(page, 15);
      const newData = res || [];
      setLogs((prev) => (page === 1 ? newData : [...prev, ...newData]));
      setHasMore(newData.length > 0);
    } catch {
      toast.error("Failed to load ledger records");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  return (
    <>
      <PageHeader
        title="Global Ledger"
        subtitle="Audit trail for usage and purchases across institutions."
        breadcrumb={[
          { label: "System", href: "/admin/schools" },
          { label: "Ledger" },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            placeholder="Search school or plan"
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
            >
              <XCircle size={15} />
            </button>
          )}
        </div>
        <Select value={opFilter} onValueChange={setOpFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Operation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All operations</SelectItem>
            <SelectItem value="USAGE">Usage only</SelectItem>
            <SelectItem value="SUBSCRIPTION_PURCHASED">
              Purchases only
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredLogs.length === 0 && !loading ? (
          <EmptyState
            icon={History}
            title="No ledger entries"
            description={
              searchQuery
                ? "No records match your filters."
                : "Ledger entries appear as schools use credits."
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Plan instance</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-[12px] mono text-ink-3 whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-ink">
                        {log.school.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="mono text-[11px]">
                        {log.planInstance.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.operation === "SUBSCRIPTION_PURCHASED" ? (
                        <Badge variant="success" dot>
                          <ArrowDownLeft size={11} /> Purchase
                        </Badge>
                      ) : (
                        <Badge variant="info">
                          <ArrowUpRight size={11} /> Usage
                          {log.channel?.channel === "EMAIL" ? (
                            <Mail size={11} className="ml-1" />
                          ) : log.channel?.channel === "SMS" ? (
                            <MessageSquare size={11} className="ml-1" />
                          ) : null}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right mono font-semibold">
                      <span
                        className={
                          log.creditsUsed > 0
                            ? "text-warning-ink"
                            : "text-ink-3"
                        }
                      >
                        {log.creditsUsed > 0 ? `-${log.creditsUsed}` : "0"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div
              ref={lastElementRef}
              className="py-6 flex justify-center w-full"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-ink-3" />
              ) : !hasMore ? (
                <p className="text-[12px] text-ink-3">End of ledger.</p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  );
}
