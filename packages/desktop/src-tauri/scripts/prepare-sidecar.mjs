import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const triples = {
  "darwin-arm64": "aarch64-apple-darwin",
  "darwin-x64": "x86_64-apple-darwin",
  "linux-arm64": "aarch64-unknown-linux-gnu",
  "linux-x64": "x86_64-unknown-linux-gnu",
  "win32-x64": "x86_64-pc-windows-msvc",
  "win32-arm64": "aarch64-pc-windows-msvc",
}

const key = `${process.platform}-${process.arch}`
const targetTriple = process.env.TAURI_ENV_TARGET_TRIPLE || triples[key]

if (!targetTriple) {
  throw new Error(`Unsupported platform/arch for sidecar: ${key}`)
}

const scriptFile = fileURLToPath(import.meta.url)
const srcTauriDir = path.resolve(path.dirname(scriptFile), "..")
const repoRoot = path.resolve(srcTauriDir, "../../..")
const serverDistDir = path.join(repoRoot, "apps", "server", "dist")
const serverPath = path.join(serverDistDir, process.platform === "win32" ? "server.exe" : "server")

if (!fs.existsSync(serverPath)) {
  execSync("pnpm --filter @lumo/server build", { cwd: repoRoot, stdio: "inherit" })
}

const sidecarDir = path.join(srcTauriDir, "binaries")
fs.mkdirSync(sidecarDir, { recursive: true })

const sidecarName = process.platform === "win32"
  ? `lumo-server-${targetTriple}.exe`
  : `lumo-server-${targetTriple}`
const sidecarPath = path.join(sidecarDir, sidecarName)

fs.copyFileSync(serverPath, sidecarPath)

if (process.platform !== "win32") {
  fs.chmodSync(sidecarPath, 0o755)
}

console.log(`Prepared sidecar: ${sidecarPath}`)
