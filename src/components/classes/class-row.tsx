"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteSection = async (id: string) => {
    await removeSection(id);
  };

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={handleToggle}
      >
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
            {classItem.name}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            {/* Uncomment if needed
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditClass();
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClass();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
            <Button
              size="sm"
              className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddSection();
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Section
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={2} className="p-0">
            <div className="p-4 bg-muted/50 border-t max-h-60 overflow-y-auto">
              {isLoadingSections ? (
                <p className="text-muted-foreground">Loading sections…</p>
              ) : sections.length === 0 ? (
                <p className="text-muted-foreground">No sections yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Section Name</TableHead>
                      {/*<TableHead>Actions</TableHead>*/}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((s) => (
                      <SectionRow
                        key={s.id}
                        section={s}
                        onEdit={onEditSection}
                        onDelete={handleDeleteSection}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

interface SectionRowProps {
  section: SectionItem;
  onEdit: (s: SectionItem) => void;
  onDelete: (id: string) => void;
}

export function SectionRow({ section, onEdit, onDelete }: SectionRowProps) {
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell>{section.name}</TableCell>
      {/* Uncomment if needed
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(section)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>*/}
    </TableRow>
  );
}
