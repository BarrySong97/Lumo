import { Hono } from "hono"
import { cors } from "hono/cors"
import { onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createContext, type ChatService } from "@lumo/api/context"
import { itemRouter } from "@lumo/api/routers/index"
import { createDatabase } from "@lumo/db"
import { join } from "path"
import { homedir } from "os"

function getDefaultDbPath(): string {
  const platform = process.platform
  const home = homedir()

  if (platform === "win32") {
    return join(process.env.APPDATA || join(home, "AppData", "Roaming"), "Lumo", "lumo.db")
  } else if (platform === "darwin") {
    return join(home, "Library", "Application Support", "Lumo", "lumo.db")
  } else {
    return join(process.env.XDG_DATA_HOME || join(home, ".local", "share"), "Lumo", "lumo.db")
  }
}

function getDbPath(): string {
  if (process.env.LUMO_DB_PATH) {
    return process.env.LUMO_DB_PATH
  }

  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    return "./lumo.db"
  }

  return getDefaultDbPath()
}

const dbPath = getDbPath()
const db = createDatabase({ path: dbPath })

function getChatModel(model?: string): "gpt-4o-mini" | "gpt-4o" {
  if (model === "gpt-4o") {
    return "gpt-4o"
  }
  return "gpt-4o-mini"
}

const chatService: ChatService = {
  async *stream(input, signal) {
    const apiKey = input.openAIApiKey || process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("Missing OpenAI API key. Please set it in chat settings or OPENAI_API_KEY.")
    }

    const openai = createOpenAI({
      apiKey,
      baseURL: input.openAIBaseURL,
    })

    const result = streamText({
      model: openai(getChatModel(input.model)),
      system:
        process.env.AI_SYSTEM_PROMPT ||
        "You are a helpful assistant. Keep answers concise and practical.",
      messages: input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      abortSignal: signal,
    })

    for await (const textPart of result.textStream) {
      if (signal?.aborted) {
        return
      }

      if (!textPart) {
        continue
      }

      yield {
        type: "delta" as const,
        text: textPart,
      }
    }

    yield {
      type: "done" as const,
    }
  },
}

function getAllowedOrigins(): Set<string> {
  const configured = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  const defaults = [
    "http://localhost:1420",
    "http://127.0.0.1:1420",
    "tauri://localhost",
    "http://tauri.localhost",
  ]

  return new Set([...defaults, ...configured])
}

const allowedOrigins = getAllowedOrigins()

const rpcHandler = new RPCHandler(itemRouter, {
  interceptors: [
    onError((error) => {
      console.error("[RPC Error]", error)
    }),
  ],
})

const app = new Hono()

app.use("/*", cors({
  origin: (origin) => {
    if (!origin) {
      return "http://localhost:1420"
    }
    return allowedOrigins.has(origin) ? origin : "http://localhost:1420"
  },
  credentials: true,
  allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type"],
}))

app.get("/health", (c) => {
  return c.json({ status: "ok" })
})

app.all("/rpc*", async (c) => {
  const { response } = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: createContext({ db, chat: chatService }),
  })
  return response ?? c.json({ error: "Not Found" }, 404)
})

const port = parseInt(process.env.PORT || "3001")

export default {
  port,
  fetch: app.fetch,
}

console.log(`Server running on http://localhost:${port}`)
console.log(`Database path: ${dbPath}`)
console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
