import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export default function SectionCard({
  title,
  subtitle,
  actions,
  footer,
  children,
  className,
  bodyClassName,
  noPadding,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "bg-surface border border-border rounded-xl overflow-hidden",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-divider">
          <div className="min-w-0">
            {title && (
              <div className="text-[15px] font-semibold text-ink truncate">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[13px] text-ink-3 mt-0.5">{subtitle}</div>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </header>
      )}
      <div className={cn(!noPadding && "p-5", bodyClassName)}>{children}</div>
      {footer && (
        <footer className="flex items-center justify-between gap-3 px-5 py-3 border-t border-divider bg-bg-2">
          {footer}
        </footer>
      )}
    </section>
  );
}
