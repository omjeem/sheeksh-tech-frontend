import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { notificationService } from "@/services/notificationService";
import { Category } from "@/types/notification";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const getColorClass = (str: string) => {
  const colors = [
    "bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20",
    "bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20",
    "bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20",
    "bg-pink-500/10 text-pink-600 border-pink-200 hover:bg-pink-500/20",
    "bg-sky-500/10 text-sky-600 border-sky-200 hover:bg-sky-500/20",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

interface CategoriesBarProps {
  selectedId: string | null;
  onSelect: (category: Category) => void;
  disabled?: boolean;
}

export default function CategoriesBar({
  selectedId,
  onSelect,
  disabled = false,
}: CategoriesBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Creation State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await notificationService.categories.list();
      setCategories(res);
      // Auto-select first if none selected
      if (!selectedId && res.length > 0) {
        onSelect(res[0]);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreating(true);
    try {
      const newCat =
        await notificationService.categories.create(newCategoryName);
      setCategories((prev) => [...prev, ...newCat]);
      onSelect(newCat?.[0]); // Auto select the new one
      setNewCategoryName("");
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (isLoading)
    return <div className="h-8 w-full bg-muted/50 animate-pulse rounded" />;

  return (
    <div className="space-y-3">
      <Label>Category</Label>
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const colorClass = getColorClass(cat?.category);

          return (
            <button
              key={cat.id}
              onClick={disabled ? undefined : () => onSelect(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                isSelected
                  ? cn(colorClass, "font-semibold")
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground",
              )}
            >
              {cat?.category}
            </button>
          );
        })}

        {/* Create Trigger */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-full px-2 text-xs border-dashed text-muted-foreground gap-1 hover:text-primary hover:border-primary/50"
            >
              <Plus className="h-3 w-3" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form action={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Sports Event"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating || !newCategoryName}>
                  {isCreating ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
