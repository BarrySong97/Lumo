import { os } from "@orpc/server"
import { z } from "zod"
import { db, type Item } from "./db"

// Item schema
const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const CreateItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

const UpdateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
})

// Item procedures
const itemCreate = os
  .input(CreateItemSchema)
  .output(ItemSchema)
  .handler(async (input) => {
    const stmt = db.prepare(
      "INSERT INTO Item (name, description) VALUES (?, ?)"
    )
    const result = stmt.run(input.name, input.description || null)

    const item = db
      .prepare("SELECT * FROM Item WHERE id = ?")
      .get(result.lastInsertRowid)

    return item as Item
  })

const itemList = os
  .output(z.array(ItemSchema))
  .handler(async () => {
    const items = db.prepare("SELECT * FROM Item ORDER BY createdAt DESC").all()
    return items as Item[]
  })

const itemGet = os
  .input(z.object({ id: z.number() }))
  .output(ItemSchema)
  .handler(async (input) => {
    const item = db.prepare("SELECT * FROM Item WHERE id = ?").get(input.id)

    if (!item) {
      throw new Error("Item not found")
    }

    return item as Item
  })

const itemUpdate = os
  .input(
    z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    })
  )
  .output(ItemSchema)
  .handler(async (input) => {
    const { id, ...updates } = input

    const item = db.prepare("SELECT * FROM Item WHERE id = ?").get(id)
    if (!item) {
      throw new Error("Item not found")
    }

    const updateFields: string[] = []
    const updateValues: (string | number | null)[] = []

    if (updates.name !== undefined) {
      updateFields.push("name = ?")
      updateValues.push(updates.name)
    }

    if (updates.description !== undefined) {
      updateFields.push("description = ?")
      updateValues.push(updates.description || null)
    }

    updateFields.push("updatedAt = CURRENT_TIMESTAMP")
    updateValues.push(id)

    const stmt = db.prepare(
      `UPDATE Item SET ${updateFields.join(", ")} WHERE id = ?`
    )
    stmt.run(...updateValues)

    const updated = db.prepare("SELECT * FROM Item WHERE id = ?").get(id)
    return updated as Item
  })

const itemDelete = os
  .input(z.object({ id: z.number() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async (input) => {
    const item = db.prepare("SELECT * FROM Item WHERE id = ?").get(input.id)

    if (!item) {
      throw new Error("Item not found")
    }

    db.prepare("DELETE FROM Item WHERE id = ?").run(input.id)
    return { success: true }
  })

// Create router
export const router = {
  item: {
    create: itemCreate,
    list: itemList,
    get: itemGet,
    update: itemUpdate,
    delete: itemDelete,
  },
}

export type Router = typeof router
