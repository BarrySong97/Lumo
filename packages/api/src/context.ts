import type { Database } from "@lumo/db"

export type CreateContextOptions = {
  db: Database
}

export type Context = {
  db: Database
}

export function createContext({ db }: CreateContextOptions): Context {
  return {
    db,
  }
}
