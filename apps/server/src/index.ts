import { Hono } from "hono"
import { RPCHandler } from "@orpc/server/fetch"
import { z } from "zod"
import { createProcedure, createRouter } from "@orpc/server"
import { initDb, db } from "./db"

// Initialize database
initDb()

// Define Item schema
const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const CreateItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
})

const UpdateItemSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
})

// Define inline router with CRUD procedures
const router = createRouter({
  item: createRouter({
    list: createProcedure()
      .outputs(z.array(ItemSchema))
      .handler(async () => {
        const stmt = db.prepare("SELECT * FROM Item ORDER BY createdAt DESC")
        return stmt.all() as z.infer<typeof ItemSchema>[]
      }),

    get: createProcedure()
      .inputs(z.number())
      .outputs(ItemSchema)
      .handler(async (id) => {
        const stmt = db.prepare("SELECT * FROM Item WHERE id = ?")
        const item = stmt.get(id) as z.infer<typeof ItemSchema> | undefined
        if (!item) {
          throw new Error(`Item with id ${id} not found`)
        }
        return item
      }),

    create: createProcedure()
      .inputs(CreateItemSchema)
      .outputs(ItemSchema)
      .handler(async (input) => {
        const stmt = db.prepare(
          "INSERT INTO Item (name, description, createdAt, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        )
        const result = stmt.run(input.name, input.description || "")
        const id = result.lastInsertRowid as number
        const getStmt = db.prepare("SELECT * FROM Item WHERE id = ?")
        return getStmt.get(id) as z.infer<typeof ItemSchema>
      }),

    update: createProcedure()
      .inputs(z.object({ id: z.number(), data: UpdateItemSchema }))
      .outputs(ItemSchema)
      .handler(async ({ id, data }) => {
        const getStmt = db.prepare("SELECT * FROM Item WHERE id = ?")
        const existing = getStmt.get(id) as z.infer<typeof ItemSchema> | undefined
        if (!existing) {
          throw new Error(`Item with id ${id} not found`)
        }

        const name = data.name ?? existing.name
        const description = data.description ?? existing.description

        const updateStmt = db.prepare(
          "UPDATE Item SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?"
        )
        updateStmt.run(name, description, id)

        const updated = getStmt.get(id) as z.infer<typeof ItemSchema>
        return updated
      }),

    delete: createProcedure()
      .inputs(z.number())
      .outputs(z.object({ success: z.boolean() }))
      .handler(async (id) => {
        const getStmt = db.prepare("SELECT * FROM Item WHERE id = ?")
        const existing = getStmt.get(id)
        if (!existing) {
          throw new Error(`Item with id ${id} not found`)
        }

        const deleteStmt = db.prepare("DELETE FROM Item WHERE id = ?")
        deleteStmt.run(id)
        return { success: true }
      }),
  }),
})

const app = new Hono()

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" })
})

// Create RPC handler with error interceptor
const rpcHandler = new RPCHandler({
  router,
  onError: (error) => {
    console.error("RPC Error:", error)
  },
})

// Wire RPC handler to /rpc prefix
app.all("/rpc/*", async (c) => {
  const path = c.req.path.replace("/rpc", "")
  const request = new Request(
    new URL(path, `http://localhost:${process.env.PORT || 3001}`),
    {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.method !== "GET" ? await c.req.text() : undefined,
    }
  )

  const response = await rpcHandler.fetch(request)
  return response
})

const port = parseInt(process.env.PORT || "3001")

export default {
  port,
  fetch: app.fetch,
}

console.log(`Server running on http://localhost:${port}`)

