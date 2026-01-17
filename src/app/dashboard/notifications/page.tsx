"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  MoreHorizontal,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";

import { notificationService } from "@/services/notificationService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress"; // Assuming you have this or standard HTML progress
import { upperCase } from "lodash";
import { toast } from "sonner";

// --- Types based on your JSON ---
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

      toast.success("Notification sent successfully!");

      // Refresh data to show updated status (from DRAFT to SENT/COMPLETED)
      await loadData();
    } catch (err) {
      const error = err as Error;
      console.error("Send error:", error);
      toast.error(error.message || "Failed to send notification draft.");
    } finally {
      setIsSending(null);
    }
  };

  const filteredData = data.filter((item) =>
    item.payload.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Monitor delivery status and manage drafts.
          </p>
        </div>
        <Button onClick={() => router.push("/notifications/templates")}>
          Create New Notification
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="flex-1 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Subject & Details</TableHead>
              <TableHead>Notification Channel</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No notifications found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id} className="group">
                  {/* Column 1: Subject */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span
                        className="font-semibold text-base truncate max-w-[350px]"
                        title={item.payload.subject}
                      >
                        {item.payload.subject}
                      </span>
                      <div className="flex gap-2 text-xs text-muted-foreground items-center">
                        <span className="bg-muted px-1.5 py-0.5 rounded border">
                          ID: {item.id.slice(0, 8)}...
                        </span>
                        {item.payload.variables.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />{" "}
                            {item.payload.variables.length} vars
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Column 2: Channels & Status */}
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {item.status.map((stat) => (
                        <div key={stat.id} className="flex items-center gap-2">
                          {stat.channel === "EMAIL" ? (
                            <Mail className="h-3.5 w-3.5" />
                          ) : (
                            <MessageSquare className="h-3.5 w-3.5" />
                          )}
                          <Badge
                            variant={
                              stat.status === "DRAFT"
                                ? "secondary"
                                : stat.status === "COMPLETED"
                                  ? "default"
                                  : "destructive"
                            }
                            className="text-[9px] px-1 h-4"
                          >
                            {stat.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* Column 3: Delivery Stats */}
                  <TableCell>
                    <div className="flex flex-col gap-3 min-w-[150px]">
                      {item.status.map((stat) => {
                        if (stat.status === "DRAFT")
                          return (
                            <span
                              key={stat.id}
                              className="text-xs text-muted-foreground"
                            >
                              DRAFT
                            </span>
                          );

                        const percentage =
                          stat.totalRecipients > 0
                            ? Math.round(
                                (stat.totalSuccess / stat.totalRecipients) *
                                  100,
                              )
                            : 0;

                        return (
                          <div key={stat.id} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{stat.channel}</span>
                              <span className="text-muted-foreground">
                                {stat.totalSuccess}/{stat.totalRecipients}
                              </span>
                            </div>
                            <Progress value={percentage} className="h-1.5" />
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>

                  {/* Column 4: Date */}
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">
                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.createdAt), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>

                  {/* Column 5: Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isSending === item.id}
                        >
                          {isSending === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="sr-only">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setSelectedNotification(item)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {item.status.some((s) => s.status === "DRAFT") && (
                          <DropdownMenuItem
                            onClick={() => handleSendDraft(item.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Send Draft
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Slide-over Sheet for Details */}
      {selectedNotification && (
        <Sheet
          open={!!selectedNotification}
          onOpenChange={() => setSelectedNotification(null)}
        >
          <SheetContent className="min-w-[40vw] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Notification Details</SheetTitle>
              <SheetDescription>
                Drafted on{" "}
                {selectedNotification &&
                  format(new Date(selectedNotification.createdAt), "PPpp")}
              </SheetDescription>
            </SheetHeader>

            {selectedNotification && (
              <div className="space-y-6 px-3">
                {/* Stats Grid */}
                <div className="flex gap-4">
                  {selectedNotification.status.map((s) => (
                    <div
                      key={s.id}
                      className="border rounded-xl p-4 bg-card shadow-sm flex-1"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                          <p className="flex items-center gap-3">
                            <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {s.channel === "EMAIL" ? (
                                <Mail className="h-5 w-5" />
                              ) : (
                                <MessageSquare className="h-5 w-5" />
                              )}
                            </span>
                            <span className="text-sm font-bold">
                              {s.channel} Channel
                            </span>
                          </p>
                          <span className="text-xs">
                            {s.status} AT:{" "}
                            {format(new Date(s.createdAt), "PPpp")}
                          </span>
                        </div>
                        <Badge className="font-mono">{s.status}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted/50 p-2 rounded-lg">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            Total
                          </p>
                          <p className="text-lg font-bold">
                            {s.totalRecipients}
                          </p>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20 text-green-700">
                          <p className="text-[10px] uppercase font-bold">
                            Success
                          </p>
                          <p className="text-lg font-bold">{s.totalSuccess}</p>
                        </div>
                        <div className="bg-destructive/10 p-2 rounded-lg border border-destructive/20 text-destructive">
                          <p className="text-[10px] uppercase font-bold">
                            Failure
                          </p>
                          <p className="text-lg font-bold">{s.totalFailure}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Subject
                  </h3>
                  <p className="p-3 border rounded-md bg-background font-medium">
                    {selectedNotification.payload.subject}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Content Preview
                  </h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted/20 p-2 border-b text-xs flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div
                      className="p-4 prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-black"
                      dangerouslySetInnerHTML={{
                        __html: selectedNotification.payload.bodyHtml?.replace(
                          /\{\{([^}]+)\}\}/g,
                          (_, k) => upperCase(k.trim()),
                        ),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Used Placeholders
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotification.payload.variables.map((v) => (
                      <Badge
                        key={v}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {upperCase(v)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
