"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
} from "lucide-react";

import { notificationService } from "@/services/notificationService";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { upperCase } from "lodash";
import { toast } from "sonner";
import { convertHtmlVariablesToUpperCase } from "@/lib/tiptap-utils";
import PageHeader from "@/components/common/page-header";
import Stat from "@/components/common/stat";
import EmptyState from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationStatus {
  id: string;
  channel: "EMAIL" | "SMS";
  status: "DRAFT" | "SENT" | "FAILED" | "COMPLETED";
  totalRecipients: number;
  totalSuccess: number;
  totalFailure: number;
  createdAt: string;
}

interface NotificationItem {
  id: string;
  templateId: string;
  categoryId: string;
  createdAt: string;
  channels: ("EMAIL" | "SMS")[];
  payload: {
    subject: string;
    bodyHtml: string;
    bodyText: string;
    variables: string[];
  };
  status: NotificationStatus[];
}

const statusBadge = (status: NotificationStatus["status"]) => {
  if (status === "DRAFT") return <Badge>Draft</Badge>;
  if (status === "COMPLETED" || status === "SENT")
    return (
      <Badge variant="success" dot>
        {status === "SENT" ? "Sent" : "Completed"}
      </Badge>
    );
  return (
    <Badge variant="danger" dot>
      Failed
    </Badge>
  );
};

export default function NotificationsPage() {
  const router = useRouter();
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSending, setIsSending] = useState<string | null>(null);

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await notificationService.notifications.admin();
      setData(res as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDraft = async (id: string) => {
    setIsSending(id);
    try {
      await notificationService.notifications.sendDraft(id);
      toast.success("Notification sent successfully");
      await loadData();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to send notification draft.");
    } finally {
      setIsSending(null);
    }
  };

  const filteredData = data.filter((item) =>
    item.payload.subject.toLowerCase().includes(search.toLowerCase()),
  );

  // Stat calculations from real data
  const totalSent = data.reduce(
    (acc, n) =>
      acc + n.status.reduce((a, s) => a + (s.totalSuccess || 0), 0),
    0,
  );
  const totalRecipients = data.reduce(
    (acc, n) =>
      acc + n.status.reduce((a, s) => a + (s.totalRecipients || 0), 0),
    0,
  );
  const totalFailed = data.reduce(
    (acc, n) =>
      acc + n.status.reduce((a, s) => a + (s.totalFailure || 0), 0),
    0,
  );
  const draftCount = data.filter((n) =>
    n.status.some((s) => s.status === "DRAFT"),
  ).length;
  const deliveryRate =
    totalRecipients > 0
      ? `${((totalSent / totalRecipients) * 100).toFixed(1)}%`
      : "—";

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Monitor delivery and manage drafts."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notifications" },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/dashboard/templates")}
            >
              <FileText size={14} /> Templates
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/templates")}
            >
              <Plus size={14} /> New notification
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Stat
          label="Sent · this month"
          value={totalSent ? totalSent.toLocaleString() : "—"}
          icon={Send}
        />
        <Stat label="Delivery rate" value={deliveryRate} icon={CheckCircle2} />
        <Stat
          label="Failed"
          value={totalFailed ? totalFailed.toLocaleString() : "—"}
          deltaDir="down"
          icon={AlertCircle}
          tone="danger"
        />
        <Stat
          label="Drafts"
          value={draftCount.toString()}
          icon={FileText}
          tone="warning"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            placeholder="Search by subject"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="Start from a template to compose and send your first notification."
            action={
              <Button
                size="sm"
                onClick={() => router.push("/dashboard/templates")}
              >
                <Plus size={14} /> New notification
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[1%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-ink truncate max-w-[260px]">
                      {item.payload.subject}
                    </div>
                    <div className="mono text-[11px] text-ink-3">
                      ID: {item.id.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.status.map((stat) => (
                        <div
                          key={stat.id}
                          className="flex items-center gap-1.5 text-[13px]"
                        >
                          {stat.channel === "EMAIL" ? (
                            <Mail size={14} className="text-ink-3" />
                          ) : (
                            <MessageSquare size={14} className="text-ink-3" />
                          )}
                          {stat.channel === "EMAIL" ? "Email" : "SMS"}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      {item.status.map((stat) => {
                        if (stat.status === "DRAFT")
                          return (
                            <span
                              key={stat.id}
                              className="text-[12px] text-ink-3"
                            >
                              —
                            </span>
                          );
                        const percentage =
                          stat.totalRecipients > 0
                            ? Math.round(
                                (stat.totalSuccess /
                                  stat.totalRecipients) *
                                  100,
                              )
                            : 0;
                        return (
                          <div key={stat.id}>
                            <div className="flex justify-between text-[12px] mb-1">
                              <span className="tnum">
                                {stat.totalSuccess}/{stat.totalRecipients}
                              </span>
                              <span className="text-ink-3">{percentage}%</span>
                            </div>
                            <Progress
                              value={percentage}
                              tone={
                                stat.status === "FAILED" ? "danger" : "brand"
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-3 whitespace-nowrap text-[13px]">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                    <div className="text-[11px] flex items-center gap-1">
                      <Clock size={11} />
                      {format(new Date(item.createdAt), "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.status.map((stat) => (
                        <div key={stat.id}>{statusBadge(stat.status)}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap w-[1%]">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={isSending === item.id}
                        >
                          {isSending === item.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <MoreHorizontal size={14} />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.preventDefault();
                            setSelectedNotification(item);
                          }}
                        >
                          <Eye size={14} /> View details
                        </DropdownMenuItem>
                        {item.status.some((s) => s.status === "DRAFT") && (
                          <DropdownMenuItem
                            onClick={() => handleSendDraft(item.id)}
                          >
                            <Send size={14} /> Send draft
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet
        open={!!selectedNotification}
        onOpenChange={(open) => {
          if (!open) setSelectedNotification(null);
        }}
      >
        <SheetContent className="min-w-[100vw] sm:min-w-[480px] lg:min-w-[640px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Notification details</SheetTitle>
            <SheetDescription>
              Drafted on{" "}
              {selectedNotification &&
                format(new Date(selectedNotification.createdAt), "PPpp")}
            </SheetDescription>
          </SheetHeader>

          {selectedNotification && (
            <div className="space-y-6 px-4 pb-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedNotification.status.map((s) => (
                  <div
                    key={s.id}
                    className="border border-border rounded-xl p-4 bg-surface"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="size-9 rounded-md bg-brand-soft text-brand grid place-items-center">
                          {s.channel === "EMAIL" ? (
                            <Mail size={16} />
                          ) : (
                            <MessageSquare size={16} />
                          )}
                        </span>
                        <div>
                          <div className="text-[13px] font-semibold">
                            {s.channel}
                          </div>
                          <div className="text-[11px] text-ink-3">
                            {format(new Date(s.createdAt), "MMM d, h:mm a")}
                          </div>
                        </div>
                      </div>
                      {statusBadge(s.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-surface-2 p-2 rounded-md text-center">
                        <div className="text-[10px] text-ink-3 uppercase font-semibold">
                          Total
                        </div>
                        <div className="text-[16px] font-semibold tnum">
                          {s.totalRecipients}
                        </div>
                      </div>
                      <div className="bg-success-soft text-success-ink p-2 rounded-md text-center">
                        <div className="text-[10px] uppercase font-semibold">
                          Success
                        </div>
                        <div className="text-[16px] font-semibold tnum">
                          {s.totalSuccess}
                        </div>
                      </div>
                      <div className="bg-danger-soft text-danger-ink p-2 rounded-md text-center">
                        <div className="text-[10px] uppercase font-semibold">
                          Failure
                        </div>
                        <div className="text-[16px] font-semibold tnum">
                          {s.totalFailure}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="eyebrow mb-2">Subject</p>
                <p className="p-3 border border-border rounded-md bg-surface font-medium">
                  {selectedNotification.payload.subject}
                </p>
              </div>

              <div>
                <p className="eyebrow mb-2">Content preview</p>
                <div className="border border-border rounded-md overflow-hidden">
                  <div className="bg-surface-2 px-2 py-1.5 border-b border-divider text-[11px] flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[oklch(0.84_0.02_30)]" />
                    <span className="size-2.5 rounded-full bg-[oklch(0.88_0.02_80)]" />
                    <span className="size-2.5 rounded-full bg-[oklch(0.84_0.02_155)]" />
                  </div>
                  <div
                    className="p-4 prose prose-sm max-w-none bg-white"
                    dangerouslySetInnerHTML={{
                      __html: convertHtmlVariablesToUpperCase(
                        selectedNotification?.payload?.bodyHtml ?? "",
                      ),
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="eyebrow mb-2">Used placeholders</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNotification.payload.variables.map((v) => (
                    <Badge key={v} variant="brand" className="mono text-[11px]">
                      {upperCase(v)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
