import { toast } from "sonner";
import useSWR from "swr";

type UseCRUDOptions<T, CreateDTO = T, UpdateDTO = Partial<T>> = {
  key: string | null;
  listFn: () => Promise<T[]>;
  createFn: (data: CreateDTO) => Promise<T>;
  updateFn: (id: string, data: UpdateDTO) => Promise<T>;
  deleteFn: (id: string) => Promise<void>;
  onSuccess?: (action: "create" | "update" | "delete") => void;
};

export function useCRUD<T, CreateDTO = T, UpdateDTO = Partial<T>>(
  options: UseCRUDOptions<T, CreateDTO, UpdateDTO>,
) {
  const { key, listFn, createFn, updateFn, deleteFn, onSuccess } = options;

  const { data, error, mutate, isLoading } = useSWR<T[]>(key, listFn, {
    revalidateOnFocus: false,
  });

  const create = async (data: CreateDTO) => {
    try {
      await createFn(data);
      toast.success("Created successfully");
      await mutate();
      onSuccess?.("create");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Create failed");
      throw err;
    }
  };

  const update = async (id: string, data: UpdateDTO) => {
    try {
      await updateFn(id, data);
      toast.success("Updated successfully");
      await mutate();
      onSuccess?.("update");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Update failed");
      throw err;
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteFn(id);
      toast.success("Deleted successfully");
      await mutate();
      onSuccess?.("delete");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Delete failed");
      throw error;
    }
  };

  return {
    data: data ?? [],
    isLoading,
    error,
    mutate,
    create,
    update,
    remove,
  };
}
