import type { Router } from "./router"

/**
 * Create an oRPC client for the web app
 * This client will communicate with the server via HTTP
 */
export function createClient(baseURL: string = "http://localhost:3001") {
  const rpcURL = `${baseURL}/rpc`

  return {
    item: {
      async create(input: Parameters<Router["item"]["create"]>[0]) {
        const response = await fetch(`${rpcURL}/item.create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        return response.json()
      },

      async list() {
        const response = await fetch(`${rpcURL}/item.list`)
        return response.json()
      },

      async get(input: Parameters<Router["item"]["get"]>[0]) {
        const response = await fetch(`${rpcURL}/item.get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        return response.json()
      },

      async update(input: Parameters<Router["item"]["update"]>[0]) {
        const response = await fetch(`${rpcURL}/item.update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        return response.json()
      },

      async delete(input: Parameters<Router["item"]["delete"]>[0]) {
        const response = await fetch(`${rpcURL}/item.delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        return response.json()
      },
    },
  } as Router
}

/**
 * Default client instance for use in the web app
 */
export const client = createClient()
