"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { UserMinus, UserCheck, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RecipientFilter {
  sentAll: boolean;
  isInclude: boolean;
  values: string[];
}

interface LogicControllerProps {
  label: string;
  state: RecipientFilter;
  onUpdate: (updates: Partial<RecipientFilter>) => void;
  icon?: React.ReactNode;
}

export function LogicController({
  label,
  state,
  onUpdate,
  icon,
}: LogicControllerProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-all border-l-4 border-l-primary/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-semibold text-sm tracking-tight">{label}</span>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border">
          <Label className="text-[10px] font-bold uppercase cursor-pointer">
            Send to All
          </Label>
          <Switch
            checked={state.sentAll}
            onCheckedChange={(val) => onUpdate({ sentAll: val, values: [] })}
          />
        </div>
      </div>

      {!state.sentAll && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <RadioGroup
            value={state.isInclude ? "include" : "exclude"}
            onValueChange={(v) => onUpdate({ isInclude: v === "include" })}
            className="grid grid-cols-2 gap-2"
          >
            <div
              className={cn(
                "flex items-center space-x-2 border rounded-lg p-2 cursor-pointer",
                state.isInclude
                  ? "bg-primary/5 border-primary/30"
                  : "hover:bg-muted",
              )}
            >
              <RadioGroupItem value="include" id={`inc-${label}`} />
              <Label
                htmlFor={`inc-${label}`}
                className="text-xs font-semibold flex items-center gap-1.5 grow cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-primary" /> Include
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2 border rounded-lg p-2 cursor-pointer",
                !state.isInclude
                  ? "bg-destructive/5 border-destructive/30"
                  : "hover:bg-muted",
              )}
            >
              <RadioGroupItem value="exclude" id={`exc-${label}`} />
              <Label
                htmlFor={`exc-${label}`}
                className="text-xs font-semibold flex items-center gap-1.5 grow cursor-pointer"
              >
                <UserMinus className="h-3.5 w-3.5 text-destructive" /> Exclude
              </Label>
            </div>
          </RadioGroup>
          <div
            className={cn(
              "text-[10px] font-bold uppercase px-3 py-1 rounded-md flex items-center justify-between border",
              state.isInclude
                ? "bg-primary/5 text-primary border-primary/20"
                : "bg-destructive/5 text-destructive border-destructive/20",
            )}
          >
            <span>{state.isInclude ? "Whitelist Mode" : "Blacklist Mode"}</span>
            <Badge variant="outline" className="h-5">
              {state.values.length} selected
            </Badge>
          </div>
        </div>
      )}
      {state.sentAll && (
        <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-200">
          <Globe className="h-3.5 w-3.5" />
          <span>Broadcasting to everyone in this category.</span>
        </div>
      )}
    </div>
  );
}
