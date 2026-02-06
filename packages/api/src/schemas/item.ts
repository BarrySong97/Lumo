import { z } from "zod"

export const ItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateItemInputSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
})

export const UpdateItemInputSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
})

export const GetItemInputSchema = z.object({
  id: z.number().int().positive(),
})

export const DeleteItemInputSchema = z.object({
  id: z.number().int().positive(),
})

export const ItemListOutputSchema = z.array(ItemSchema)

export const DeleteItemOutputSchema = z.object({
  success: z.boolean(),
})
