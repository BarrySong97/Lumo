import type { z } from "zod"

import type {
  ItemSchema,
  CreateItemInputSchema,
  UpdateItemInputSchema,
  GetItemInputSchema,
  DeleteItemInputSchema,
  ItemListOutputSchema,
  DeleteItemOutputSchema,
} from "../schemas/item"

export type Item = z.infer<typeof ItemSchema>
export type CreateItemInput = z.infer<typeof CreateItemInputSchema>
export type UpdateItemInput = z.infer<typeof UpdateItemInputSchema>
export type GetItemInput = z.infer<typeof GetItemInputSchema>
export type DeleteItemInput = z.infer<typeof DeleteItemInputSchema>
export type ItemListOutput = z.infer<typeof ItemListOutputSchema>
export type DeleteItemOutput = z.infer<typeof DeleteItemOutputSchema>
