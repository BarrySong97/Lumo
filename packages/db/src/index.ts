import { Database as BunDatabase } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { eq } from "drizzle-orm"

import * as schema from "./schema"
import { item } from "./schema/item"
import type { Item, NewItem } from "./schema/item"

export type DatabaseConfig = {
  path: string
}

export function createDatabase(config: DatabaseConfig) {
  const sqlite = new BunDatabase(config.path)
  const db = drizzle(sqlite, { schema })

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  return {
    raw: db,
    item: {
      list: async (): Promise<Item[]> => {
        return db.select().from(item).orderBy(item.createdAt).all()
      },
      get: async (id: number): Promise<Item | undefined> => {
        const results = db.select().from(item).where(eq(item.id, id)).all()
        return results[0]
      },
      create: async (data: { name: string; description?: string }): Promise<Item> => {
        const now = new Date().toISOString()
        const newItem: NewItem = {
          name: data.name,
          description: data.description ?? null,
          createdAt: now,
          updatedAt: now,
        }
        const result = db.insert(item).values(newItem).returning().get()
        return result
      },
      update: async (data: { id: number; name?: string; description?: string }): Promise<Item> => {
        const now = new Date().toISOString()
        const updateData: Partial<NewItem> = { updatedAt: now }
        if (data.name !== undefined) updateData.name = data.name
        if (data.description !== undefined) updateData.description = data.description
        
        const result = db.update(item)
          .set(updateData)
          .where(eq(item.id, data.id))
          .returning()
          .get()
        return result
      },
      delete: async (id: number): Promise<void> => {
        db.delete(item).where(eq(item.id, id)).run()
      },
    },
  }
}

export type Database = ReturnType<typeof createDatabase>

export * from "./schema"
