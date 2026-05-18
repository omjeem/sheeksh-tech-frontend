"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ClassDto } from "@/types";
import type { SectionItem } from "@/types/section";
import { useSections } from "@/hooks/useSections";

interface ClassRowProps {
  classItem: ClassDto;
  onEditClass: () => void;
  onDeleteClass: () => void;
  onAddSection: () => void;
  onEditSection: (s: SectionItem) => void;
}

export function ClassRow({
  classItem,
  onEditClass,
  onDeleteClass,
  onAddSection,
  onEditSection,
}: ClassRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    data: sections = [],
    isLoading: isLoadingSections,
    remove: removeSection,
  } = useSections(classItem.id);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleDeleteSection = async (id: string) => {
    await removeSection(id);
  };

  return (
    <>
      <TableRow className="cursor-pointer" onClick={handleToggle}>
        <TableCell>
          {isExpanded ? (
            <ChevronDown size={14} className="text-ink-3" />
          ) : (
            <ChevronRight size={14} className="text-ink-3" />
          )}
        </TableCell>
        <TableCell className="font-medium">{classItem.name}</TableCell>
        <TableCell className="tnum">{sections.length}</TableCell>
        <TableCell className="text-ink-3">—</TableCell>
        <TableCell className="text-right whitespace-nowrap w-[1%]">
          <div className="flex justify-end gap-1">
            <Button
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onAddSection();
              }}
            >
              <Plus size={12} /> Section
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEditClass();
              }}
              aria-label="Edit class"
            >
              <Edit3 size={13} />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              className="text-danger-ink hover:bg-danger-soft"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClass();
              }}
              aria-label="Delete class"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-surface-2 hover:bg-surface-2">
          <TableCell colSpan={5} className="p-0">
            {isLoadingSections ? (
              <div className="flex items-center gap-2 text-ink-3 text-[13px] px-8 py-4">
                <Loader2 size={14} className="animate-spin" /> Loading sections…
              </div>
            ) : sections.length === 0 ? (
              <div className="text-ink-3 text-[13px] px-8 py-4">
                No sections yet for {classItem.name}.
              </div>
            ) : (
              <div className="flex flex-col">
                {sections.map((s) => (
                  <SectionInlineRow
                    key={s.id}
                    section={s}
                    onEdit={() => onEditSection(s)}
                    onDelete={() => handleDeleteSection(s.id)}
                  />
                ))}
              </div>
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function SectionInlineRow({
  section,
  onEdit,
  onDelete,
}: {
  section: SectionItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-8 py-2.5 border-b border-divider last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="size-7 rounded-md bg-brand-soft text-brand-ink grid place-items-center font-semibold text-[12px]">
          {section.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-ink">
            Section {section.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost">
          <Eye size={12} /> View
        </Button>
        <Button size="icon-xs" variant="ghost" onClick={onEdit}>
          <Pencil size={13} />
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          className="text-danger-ink hover:bg-danger-soft"
          onClick={onDelete}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
}
