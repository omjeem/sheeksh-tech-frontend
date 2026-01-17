"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notificationService";
import {
  Plus,
  Search,
  MoreVertical,
  FileEdit,
  Trash2,
  Calendar,
  Tag,
  Variable,
  ExternalLink,
} from "lucide-react";

// UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Template } from "@/types/notification";

// Types based on your service output

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full gap-6 p-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notification Templates
          </h1>
          <p className="text-muted-foreground">
            Manage and reuse your announcement drafts.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/templates/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Create New Template
        </Button>
      </div>

      {/* 2. Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or category..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing <strong>{filteredTemplates.length}</strong> templates
        </div>
      </div>

      {/* 3. Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onRefresh={fetchTemplates}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <Variable className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No templates found</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            {searchQuery
              ? "Try adjusting your search terms."
              : "Start by creating your first announcement template."}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Sub-component for individual cards ---
function TemplateCard({
  template,
  onRefresh,
}: {
  template: Template;
  onRefresh: () => void;
}) {
  const router = useRouter();

  return (
    <Card
      onClick={() =>
        router.push(`/dashboard/notifications/draft/${template?.id}`)
      }
      className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer overflow-hidden flex flex-col"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            <Tag className="mr-1 h-3 w-3" /> {template.category.category}
          </Badge>
          {/*<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/templates/edit/${template.id}`)}
              >
                <FileEdit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>*/}
        </div>
        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {template.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          {template.templatePayload.subject}
        </p>

        {/* Variable Chips */}
        {/*<div className="flex flex-wrap gap-1">
          {template.templatePayload.variables.slice(0, 3).map((v) => (
            <span
              key={v}
              className="text-[10px] font-mono bg-primary/5 text-primary/70 px-1.5 py-0.5 rounded border border-primary/10"
            >
              {"{{"}
              {v}
              {"}}"}
            </span>
          ))}
          {template.templatePayload.variables.length > 3 && (
            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5">
              +{template.templatePayload.variables.length - 3} more
            </span>
          )}
        </div>*/}
      </CardContent>

      <CardFooter className="pt-3 border-t bg-muted/5 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(template.updatedAt).toLocaleDateString()}
        </div>
        {/*<Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-[10px]"
          onClick={() => router.push(`/templates/edit/${template.id}`)}
        >
          View Details <ExternalLink className="ml-1 h-3 w-3" />
        </Button>*/}
      </CardFooter>
    </Card>
  );
}
