import type { Router, RouterClient } from "@orpc/server"

import type { Context } from "../context"
import type { ItemContract } from "../contracts/item"

import { i } from "./router-tools"

export type ItemRouter = Router<ItemContract, Context>

export const itemRouter: ItemRouter = {
  healthCheck: i.healthCheck.handler(() => {
    return "ok"
  }),
  item: {
    list: i.item.list.handler(async ({ context }) => {
      return context.db.item.list()
    }),
    get: i.item.get.handler(async ({ input, context, errors }) => {
      const item = await context.db.item.get(input.id)
      if (!item) {
        throw errors.NOT_FOUND()
      }
      return item
    }),
    create: i.item.create.handler(async ({ input, context }) => {
      return context.db.item.create(input)
    }),
    update: i.item.update.handler(async ({ input, context, errors }) => {
      const existing = await context.db.item.get(input.id)
      if (!existing) {
        throw errors.NOT_FOUND()
      }
      return context.db.item.update(input)
    }),
    delete: i.item.delete.handler(async ({ input, context, errors }) => {
      const existing = await context.db.item.get(input.id)
      if (!existing) {
        throw errors.NOT_FOUND()
      }
      await context.db.item.delete(input.id)
      return { success: true }
    }),
  },
}

export type ItemRouterClient = RouterClient<ItemRouter>
