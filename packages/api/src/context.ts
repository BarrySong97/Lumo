import type { Database } from "@lumo/db"
import type { ChatStreamEvent, ChatStreamInput } from "./types/chat"

export type ChatService = {
  stream(input: ChatStreamInput, signal?: AbortSignal): AsyncIterable<ChatStreamEvent>
}

export type CreateContextOptions = {
  db: Database
  chat: ChatService
}

export type Context = {
  db: Database
  chat: ChatService
}

export function createContext({ db, chat }: CreateContextOptions): Context {
  return {
    db,
    chat,
  }
}
