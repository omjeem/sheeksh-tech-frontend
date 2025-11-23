import React from "react";
import { Card } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  icon,
  loading,
}) => {
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-semibold mt-1">
          {loading ? "—" : value}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
      <div className="p-3 bg-muted rounded-full">{icon}</div>
    </Card>
  );
};

export default KpiCard;
