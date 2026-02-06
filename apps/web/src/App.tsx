import { useState } from "react"
import { type Item } from "@lumo/api"
import { Toaster } from "@lumo/ui"
import { ItemList } from "@/components/ItemList"
import { ItemForm } from "@/components/ItemForm"
import { Titlebar } from "@/components/Titlebar"
import { useItems } from "@/hooks/useItems"

export function App() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems()
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const handleCreate = async (data: { name: string; description: string }) => {
    await createItem(data)
  }

  const handleUpdate = async (data: { name: string; description: string }) => {
    if (editingItem) {
      await updateItem(editingItem.id, data)
      setEditingItem(null)
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
  }

  const handleDelete = async (id: number) => {
      await deleteItem(id)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Titlebar />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold">Items</h1>
          <p className="text-muted-foreground mt-2">Manage your items</p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {editingItem ? "Edit Item" : "Create New Item"}
          </h2>
          <ItemForm
            item={editingItem}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={editingItem ? () => setEditingItem(null) : undefined}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">All Items</h2>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          <ItemList
            items={items}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

export default App
