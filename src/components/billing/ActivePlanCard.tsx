import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { PurchasedPlan } from "@/types/billing";

export default function ActivePlanCard({ plan }: { plan: PurchasedPlan }) {
  return (
    <Card className="relative overflow-hidden group hover:border-primary/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md">{plan.name}</CardTitle>
            <CardDescription className="text-xs line-clamp-1">
              {plan.description}
            </CardDescription>
          </div>
          <Badge
            variant={plan.isExhausted ? "destructive" : "outline"}
            className="capitalize"
          >
            {plan.isExhausted ? "Exhausted" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.purchasedChannels.map((ch) => (
          <div key={ch.id} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>{ch.channel} Usage</span>
              <span>
                {ch.unitsConsumed} / {ch.unitsTotal}
              </span>
            </div>
            <Progress
              value={(ch.unitsConsumed / ch.unitsTotal) * 100}
              className="h-1.5"
            />
          </div>
        ))}
        <div className="pt-2 border-t flex justify-between items-center text-[11px] text-muted-foreground">
          <span>Purchased {new Date(plan.createdAt).toLocaleDateString()}</span>
          <span className="font-medium text-foreground italic">
            {plan.transaction[0]?.paymentProvider}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
