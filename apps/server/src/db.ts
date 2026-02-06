import Database from "better-sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get database path from environment or use default
const dbPath = process.env.LUMO_DB_PATH || path.join(__dirname, "..", "lumo.db")

export const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Create Item table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS Item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

export function initDb() {
  // Verify table exists
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Item'")
    .all()
  
  if (tables.length === 0) {
    throw new Error("Failed to create Item table")
  }
  
  console.log(`Database initialized at ${dbPath}`)
  return db
}

export type Item = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}
