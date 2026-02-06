import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import type { ItemRouterClient } from "@lumo/api"

const SERVER_URL =
  typeof window !== "undefined"
    ? import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
    : process.env.VITE_SERVER_URL || "http://localhost:3001"

export const link = new RPCLink({
  url: `${SERVER_URL}/rpc`,
  fetch(input, init) {
    return fetch(input, {
      ...init,
      credentials: "include",
    })
  },
})

export const client: ItemRouterClient = createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)

