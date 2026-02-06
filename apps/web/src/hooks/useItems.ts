import { useState, useEffect, useCallback } from "react"
import { client, type Item, type CreateItem, type UpdateItem } from "@lumo/api"

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await client.item.list()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createItem = useCallback(
    async (data: CreateItem) => {
      try {
        setError(null)
        await client.item.create(data)
        await refresh()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create item"
        setError(message)
        throw new Error(message)
      }
    },
    [refresh]
  )

  const updateItem = useCallback(
    async (id: number, data: UpdateItem) => {
      try {
        setError(null)
        await client.item.update({ id, ...data })
        await refresh()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update item"
        setError(message)
        throw new Error(message)
      }
    },
    [refresh]
  )

  const deleteItem = useCallback(
    async (id: number) => {
      try {
        setError(null)
        await client.item.delete({ id })
        await refresh()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete item"
        setError(message)
        throw new Error(message)
      }
    },
    [refresh]
  )

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh,
  }
}
