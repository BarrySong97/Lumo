import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import type { ItemRouterClient } from "./routers/item"

const DEFAULT_SERVER_URL = "http://localhost:3001"

export function getServerURL(): string {
  if (typeof window !== "undefined") {
    return (import.meta as any).env?.VITE_SERVER_URL || DEFAULT_SERVER_URL
  }
  return process.env.VITE_SERVER_URL || DEFAULT_SERVER_URL
}

export function createLink(serverURL?: string) {
  const url = serverURL || getServerURL()
  return new RPCLink({
    url: `${url}/rpc`,
    fetch(input, init) {
      return fetch(input, {
        ...init,
        credentials: "include",
      })
    },
  })
}

export const link = createLink()
export const client: ItemRouterClient = createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)

export type { ItemRouterClient }
