import { useEffect, useMemo, useState } from "react"

interface TitlebarProps {
  onManageWorkspace?: () => void
}

export function Titlebar({ onManageWorkspace: _onManageWorkspace }: TitlebarProps) {
  const [isTauri, setIsTauri] = useState(() => {
    if (typeof window === "undefined") return false
    return "__TAURI_INTERNALS__" in window || "__TAURI__" in window
  })
  const [isMaximized, setIsMaximized] = useState(false)

  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return false
    return /Mac OS X/.test(navigator.userAgent) || /Mac/.test(navigator.platform)
  }, [])

  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        setIsTauri(true)
        const maximized = await getCurrentWindow().isMaximized()
        setIsMaximized(maximized)
      } catch {
        // Not in Tauri environment
      }
    }

    checkMaximized()

    // Listen for window resize to update maximize state
    const handleResize = () => checkMaximized()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMinimize = async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window")
    await getCurrentWindow().minimize()
  }

  const handleMaximize = async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window")
    await getCurrentWindow().toggleMaximize()
    setIsMaximized(!isMaximized)
  }

  const handleClose = async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window")
    await getCurrentWindow().close()
  }

  if (!isTauri) return null

  return (
    <div
      className="h-10 bg-background flex items-center justify-between select-none"
      data-tauri-drag-region
    >
      <div className={isMac ? "w-[76px]" : "flex-1"} />

      {!isMac && (
        <div className="flex h-full">
          <button
            className="w-[46px] h-full border-none bg-transparent hover:bg-accent flex justify-center items-center cursor-pointer text-muted-foreground transition-colors duration-100 rounded-none shadow-none p-0"
            data-tauri-no-drag-region
            onClick={handleMinimize}
            title="Minimize"
            type="button"
          >
            <svg width="10" height="1" viewBox="0 0 10 1">
              <path fill="currentColor" d="M0 0h10v1H0z" />
            </svg>
          </button>

          <button
            className="w-[46px] h-full border-none bg-transparent hover:bg-accent flex justify-center items-center cursor-pointer text-muted-foreground transition-colors duration-100 rounded-none shadow-none p-0"
            data-tauri-no-drag-region
            onClick={handleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
            type="button"
          >
            {isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  fill="currentColor"
                  d="M2 0v2H0v8h8V8h2V0H2zm6 8H1V3h7v5zm1-6H3V1h6v1z"
                />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path fill="currentColor" d="M0 0v10h10V0H0zm9 9H1V1h8v8z" />
              </svg>
            )}
          </button>

          <button
            className="w-[46px] h-full border-none bg-transparent hover:bg-red-600 flex justify-center items-center cursor-pointer text-muted-foreground hover:text-white transition-colors duration-100 rounded-none shadow-none p-0"
            data-tauri-no-drag-region
            onClick={handleClose}
            title="Close"
            type="button"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                fill="currentColor"
                d="M10 .7L9.3 0 5 4.3.7 0 0 .7 4.3 5 0 9.3l.7.7L5 5.7 9.3 10l.7-.7L5.7 5z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
