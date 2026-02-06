import { type Item } from "@lumo/api"
import { Button, Card } from "@lumo/ui"
import { Trash2, Edit } from "lucide-react"

interface ItemListProps {
  items: Item[]
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
  loading?: boolean
}

export function ItemList({ items, onEdit, onDelete, loading }: ItemListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No items yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
                aria-label="Edit item"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
                aria-label="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
