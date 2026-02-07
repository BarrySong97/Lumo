import { createFileRoute } from "@tanstack/react-router"

import { SettingsPage } from "@/components/SettingsPage"

function SettingsRoutePage() {
  return <SettingsPage />
}

export const Route = createFileRoute("/settings/")({
  component: SettingsRoutePage,
})
