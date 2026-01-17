import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Mail, MessageSquare } from "lucide-react";
import { LedgerLog } from "@/types/billing";

export default function LedgerTable({ data }: { data: LedgerLog[] }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-muted/30">
          <tr className="border-b transition-colors">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Operation
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Channel
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Plan Instance
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Change
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b transition-colors hover:bg-muted/50"
            >
              <td className="p-4 align-middle">
                <Badge
                  variant={item.operation === "USAGE" ? "secondary" : "default"}
                  className="text-[10px]"
                >
                  {item.operation.replace("_", " ")}
                </Badge>
              </td>
              <td className="p-4 align-middle">
                {item.channel ? (
                  <span className="flex items-center gap-2">
                    {item.channel.channel === "SMS" ? (
                      <MessageSquare className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3" />
                    )}
                    {item.channel.channel}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-4 align-middle font-medium">
                {item.planInstance.name}
              </td>
              <td
                className={cn(
                  "p-4 align-middle text-right font-bold",
                  item.operation === "USAGE"
                    ? "text-destructive"
                    : "text-primary",
                )}
              >
                {item.operation === "USAGE" ? `-${item.creditsUsed}` : "ADDED"}
              </td>
              <td className="p-4 align-middle text-right text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
