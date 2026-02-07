import { createFileRoute } from "@tanstack/react-router"

import { Chatbot } from "@/components/Chatbot"

function ChatPage() {
  return <Chatbot />
}

export const Route = createFileRoute("/")({
  component: ChatPage,
})
