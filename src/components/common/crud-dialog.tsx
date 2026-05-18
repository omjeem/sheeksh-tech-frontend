import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

type CrudDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  size?: "default" | "lg" | "xl";
};

const sizeMap = {
  default: "sm:max-w-[520px]",
  lg: "sm:max-w-[640px]",
  xl: "sm:max-w-[800px]",
};

export function CrudDialog<T>({
  open,
  onOpenChange,
  title,
  description,
  form,
  onSubmit,
  isLoading,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  size = "default",
  children,
}: CrudDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeMap[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={form.handleSubmit((d) => onSubmit(d as T))}>
          <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
