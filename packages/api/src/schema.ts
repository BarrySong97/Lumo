import { z } from "zod"

/**
 * Item schema - represents a stored item in the database
 */
export const ItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * CreateItemSchema - for creating new items (excludes id, createdAt, updatedAt)
 */
export const CreateItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000),
})

/**
 * UpdateItemSchema - for updating items (all fields optional)
 */
export const UpdateItemSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type Item = z.infer<typeof ItemSchema>
export type CreateItem = z.infer<typeof CreateItemSchema>
export type UpdateItem = z.infer<typeof UpdateItemSchema>
