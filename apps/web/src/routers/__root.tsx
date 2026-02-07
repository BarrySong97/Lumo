import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Toaster } from "@lumo/ui"

import { Titlebar } from "@/components/Titlebar"

function RootRouteLayout() {
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background">
      <Titlebar />
      <main className="flex min-h-0 flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootRouteLayout,
})
