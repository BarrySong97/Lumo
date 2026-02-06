import { useState, useEffect } from "react"
import { type Item } from "@lumo/api"
import { Button, Input, Textarea, Card } from "@lumo/ui"

interface ItemFormProps {
  item: Item | null
  onSubmit: (data: { name: string; description: string }) => Promise<void>
  onCancel?: () => void
}

export function ItemForm({ item, onSubmit, onCancel }: ItemFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (item) {
      setName(item.name)
      setDescription(item.description || "")
    } else {
      setName("")
      setDescription("")
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
      setName("")
      setDescription("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter item description (optional)"
            rows={3}
            disabled={submitting}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting || !name.trim()}>
            {submitting ? "Saving..." : item ? "Update" : "Create"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
