import { Plan } from "@/types/billing";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PlanStoreCard({ plan }: { plan: Plan }) {
  return (
    <Card className="flex flex-col border-2 border-muted hover:border-primary transition-all shadow-sm">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold italic">₹{plan.basePrice}</span>
          <span className="text-muted-foreground text-sm">/ one-time</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          {plan.feature.map((f) => (
            <div key={f.id} className="flex items-center gap-2 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-medium">{f.units.toLocaleString()}</span>
              <span className="text-muted-foreground">{f.channel} Credits</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
