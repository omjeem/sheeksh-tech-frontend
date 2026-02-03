// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { adminService } from "@/services/adminService";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Loader2,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Mail,
//   MessageSquare,
//   History,
// } from "lucide-react";
// import { format } from "date-fns";
// import { toast } from "sonner";

// export default function NotificationLedger() {
//   const [logs, setLogs] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Intersection Observer setup
//   const observer = useRef<IntersectionObserver | null>(null);
//   const lastElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore],
//   );

//   const fetchLedger = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await adminService.getLedger(page, 15);
//       const newData = res || [];

//       setLogs((prev) => (page === 1 ? newData : [...prev, ...newData]));
//       setHasMore(newData.length > 0);
//     } catch (error) {
//       toast.error("Failed to load ledger records");
//     } finally {
//       setLoading(false);
//     }
//   }, [page]);

//   useEffect(() => {
//     fetchLedger();
//   }, [fetchLedger]);

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-primary/10 rounded-lg text-primary">
//           <History className="h-6 w-6" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             Notification Ledger
//           </h1>
//           <p className="text-muted-foreground text-sm">
//             Real-time usage and subscription audit trail.
//           </p>
//         </div>
//       </div>

//       <Card className="border-border/50 shadow-sm">
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-muted/30 sticky top-0 z-10">
//               <TableRow>
//                 <TableHead>Event & Timestamp</TableHead>
//                 <TableHead>Institution</TableHead>
//                 <TableHead>Plan Instance</TableHead>
//                 <TableHead>Operation</TableHead>
//                 <TableHead className="text-right">Credits</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {logs.map((log, index) => (
//                 <TableRow key={log.id} className="group">
//                   <TableCell>
//                     <div className="flex flex-col">
//                       <span className="text-xs font-mono text-muted-foreground">
//                         {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
//                       </span>
//                       <span className="text-[10px] opacity-50 font-mono">
//                         {log.id.slice(0, 8)}
//                       </span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col">
//                       <span className="font-medium text-sm">
//                         {log.school.name}
//                       </span>
//                       <a
//                         href={log.school.url}
//                         target="_blank"
//                         className="text-[10px] text-blue-500 hover:underline"
//                       >
//                         {log.school.url.replace("https://", "")}
//                       </a>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col">
//                       <span className="text-sm">{log.planInstance.name}</span>
//                       <Badge
//                         variant="outline"
//                         className="w-fit text-[9px] h-4 font-mono"
//                       >
//                         {log.planInstance.key}
//                       </Badge>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       {log.operation === "SUBSCRIPTION_PURCHASED" ? (
//                         <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20 gap-1">
//                           <ArrowDownLeft className="h-3 w-3" /> Purchase
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary" className="gap-1">
//                           <ArrowUpRight className="h-3 w-3" /> Usage
//                           {log.channel?.channel === "EMAIL" ? (
//                             <Mail className="h-3 w-3 ml-1" />
//                           ) : (
//                             <MessageSquare className="h-3 w-3 ml-1" />
//                           )}
//                         </Badge>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right font-mono font-bold">
//                     <span
//                       className={
//                         log.creditsUsed > 0
//                           ? "text-orange-600"
//                           : "text-muted-foreground"
//                       }
//                     >
//                       {log.creditsUsed > 0 ? `-${log.creditsUsed}` : "0"}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {/* Loading Trigger / Sentinel */}
//           <div ref={lastElementRef} className="py-8 flex justify-center w-full">
//             {loading ? (
//               <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="text-sm">Fetching more records...</span>
//               </div>
//             ) : !hasMore ? (
//               <p className="text-sm text-muted-foreground italic">
//                 End of audit trail reached
//               </p>
//             ) : null}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Mail,
  MessageSquare,
  History,
  Search,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function NotificationLedger() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [opFilter, setOpFilter] = useState("ALL");

  // Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // Only load more if we aren't currently filtering
        // (Infinite scroll usually works best on the full dataset)
        if (
          entries[0].isIntersecting &&
          hasMore
          // &&
          // searchQuery === "" &&
          // opFilter === "ALL"
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, searchQuery, opFilter],
  );

  // Frontend Filtering Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.planInstance.name.toLowerCase().includes(searchQuery.toLowerCase());
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
    } catch (error) {
      toast.error("Failed to load ledger records");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden gap-6 px-3 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Notification Ledger
            </h1>
            <p className="text-muted-foreground text-sm">
              Audit trail for usage and purchases.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search school or plan..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <XCircle
                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          <Select value={opFilter} onValueChange={setOpFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Operation Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Operations</SelectItem>
              <SelectItem value="USAGE">Usage Only</SelectItem>
              <SelectItem value="SUBSCRIPTION_PURCHASED">
                Purchases Only
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm flex-1 overflow-auto">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow>
                <TableHead>Event & Timestamp</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Plan Instance</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead className="text-right">Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-muted-foreground">
                        {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">
                      {log.school.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.planInstance.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.operation === "SUBSCRIPTION_PURCHASED" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1">
                          <ArrowDownLeft className="h-3 w-3" /> Purchase
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <ArrowUpRight className="h-3 w-3" /> Usage
                          {log.channel?.channel === "EMAIL" ? (
                            <Mail className="h-3 w-3 ml-1" />
                          ) : (
                            <MessageSquare className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    <span
                      className={
                        log.creditsUsed > 0
                          ? "text-orange-600"
                          : "text-muted-foreground"
                      }
                    >
                      {log.creditsUsed > 0 ? `-${log.creditsUsed}` : "0"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Sentinel for Infinite Scroll */}
          <div ref={lastElementRef} className="py-8 flex justify-center w-full">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : filteredLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No matching records found.
              </p>
            ) : !hasMore ? (
              <p className="text-sm text-muted-foreground">End of ledger.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
