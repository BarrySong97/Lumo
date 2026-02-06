import { z } from "zod"
import { ItemSchema, CreateItemSchema, UpdateItemSchema } from "./schema"

/**
 * Item procedures for CRUD operations
 * These are placeholder implementations that will be connected to the server
 */

// Type definitions for procedures
export type ItemCreateInput = z.infer<typeof CreateItemSchema>
export type ItemUpdateInput = z.infer<typeof UpdateItemSchema>
export type ItemGetInput = { id: number }
export type ItemDeleteInput = { id: number }
export type ItemOutput = z.infer<typeof ItemSchema>

/**
 * oRPC router type for Item CRUD operations
 * This defines the contract between client and server
 */
export type Router = {
  item: {
    create: (input: ItemCreateInput) => Promise<ItemOutput>
    list: () => Promise<ItemOutput[]>
    get: (input: ItemGetInput) => Promise<ItemOutput | null>
    update: (input: ItemUpdateInput & { id: number }) => Promise<ItemOutput>
    delete: (input: ItemDeleteInput) => Promise<{ id: number }>
  }
}
