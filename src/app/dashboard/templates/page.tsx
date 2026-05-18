"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notificationService";
import { FileText, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Template } from "@/types/notification";
import TemplateCard from "@/components/notifications/templates/TemplateCard";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import Chip from "@/components/common/chip";

const FILTERS = ["All", "Fees", "Attendance", "Exams", "Events", "Welcome"];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await notificationService.templates.list();
      setTemplates(data);
    } catch (err) {
      console.error("Failed to load templates", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates
    .filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((t) => filter === "All" || t.category.category === filter);

  return (
    <>
      <PageHeader
        title="Notification Templates"
        subtitle="Reusable message templates with merge variables."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Templates" },
        ]}
        actions={
          <Button size="sm" onClick={() => router.push("/dashboard/templates/new")}>
            <Plus size={14} /> New template
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            placeholder="Search by name or tag"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {FILTERS.map((f) => (
          <Chip
            key={f}
            active={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
            {f === "All" && (
              <span className="tnum muted ml-1">{templates.length}</span>
            )}
          </Chip>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon={FileText}
            title="No templates found"
            description={
              searchQuery
                ? "Try adjusting your search terms or filters."
                : "Start by creating your first announcement template."
            }
            action={
              <Button
                size="sm"
                onClick={() => router.push("/dashboard/templates/new")}
              >
                <Plus size={14} /> New template
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
