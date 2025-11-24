import { toast } from "sonner";
import useSWR from "swr";

type UseCRUDOptions<T, CreateDTO = T, UpdateDTO = Partial<T>> = {
  key: string | null;
  listFn: () => Promise<T[]>;
  createFn: (data: CreateDTO) => Promise<T>;
  updateFn: (id: string, data: UpdateDTO) => Promise<T>;
  deleteFn: (id: string) => Promise<void>;
  onSuccess?: (action: "create" | "update" | "delete") => void;
  resourceName?: string;
};

export function useCRUD<T, CreateDTO = T, UpdateDTO = Partial<T>>(
  options: UseCRUDOptions<T, CreateDTO, UpdateDTO>,
) {
  const {
    key,
    listFn,
    createFn,
    updateFn,
    deleteFn,
    onSuccess,
    resourceName = "Item",
  } = options;

  const { data, error, mutate, isLoading } = useSWR<T[]>(key, listFn, {
    revalidateOnFocus: false,
  });

  const create = async (data: CreateDTO) => {
    try {
      await createFn(data);
      toast.success(`${resourceName} created successfully`);
      await mutate();
      onSuccess?.("create");
    } catch (err: unknown) {
      const errorMsg =
        (err as Error).message || `${resourceName} creation failed`;
      toast.error(errorMsg);
      throw err;
    }
  };

  const update = async (id: string, data: UpdateDTO) => {
    try {
      await updateFn(id, data);
      toast.success(`${resourceName} updated successfully`);
      await mutate();
      onSuccess?.("update");
    } catch (err: unknown) {
      const errorMsg =
        (err as Error).message || `${resourceName} update failed`;
      toast.error(errorMsg);
      throw err;
    }
  };

  const remove = async (id: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${resourceName.toLowerCase()}?`,
      )
    )
      return;
    try {
      await deleteFn(id);
      toast.success(`${resourceName} deleted successfully`);
      await mutate();
      onSuccess?.("delete");
    } catch (err: unknown) {
      const error = err as Error;
      const errorMsg = error.message || `${resourceName} deletion failed`;
      toast.error(errorMsg);
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
