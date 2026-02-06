import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateItemInput, UpdateItemInput } from "@lumo/api"
import { orpc } from "@/utils/orpc"

export function useItems() {
  const queryClient = useQueryClient()

  const listQuery = useQuery(orpc.item.list.queryOptions())

  const createMutation = useMutation({
    mutationFn: (data: CreateItemInput) => orpc.item.create.call(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.item.list.queryKey() })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateItemInput) => orpc.item.update.call(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.item.list.queryKey() })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orpc.item.delete.call({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.item.list.queryKey() })
    },
  })

  return {
    items: listQuery.data ?? [],
    loading: listQuery.isLoading,
    error: listQuery.error?.message ?? null,
    createItem: createMutation.mutateAsync,
    updateItem: (id: number, data: Omit<UpdateItemInput, "id">) =>
      updateMutation.mutateAsync({ id, ...data }),
    deleteItem: deleteMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: orpc.item.list.queryKey() }),
  }
}
