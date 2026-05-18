import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("empty", className)}>
      {Icon && (
        <span className="ill">
          <Icon size={24} strokeWidth={1.6} />
        </span>
      )}
      <div className="title">{title}</div>
      {description && <div className="desc">{description}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
