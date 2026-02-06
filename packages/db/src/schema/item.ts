import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const item = sqliteTable("item", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
})

export type Item = typeof item.$inferSelect
export type NewItem = typeof item.$inferInsert
