import { create } from "zustand"
import type { OpenAIModel } from "@lumo/api"

import { client } from "@/utils/orpc"

export type ChatStatus = "ready" | "submitted" | "streaming" | "error"
export type ChatRole = "system" | "user" | "assistant"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

type ChatState = {
  input: string
  messages: ChatMessage[]
  status: ChatStatus
  error: string | null
  model: OpenAIModel
  openAIApiKey: string
  openAIBaseURL: string
  requestId: number
  abortController: AbortController | null
  setInput: (value: string) => void
  setModel: (value: OpenAIModel) => void
  setOpenAIApiKey: (value: string) => void
  setOpenAIBaseURL: (value: string) => void
  sendMessage: () => Promise<void>
  stop: () => void
  regenerate: () => Promise<void>
  clearConversation: () => void
}

type ChatSettings = {
  model: OpenAIModel
  openAIApiKey: string
  openAIBaseURL: string
}

const CHAT_SETTINGS_KEY = "lumo.chat.settings"

const defaultSettings: ChatSettings = {
  model: "gpt-4o-mini",
  openAIApiKey: "",
  openAIBaseURL: "",
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function loadSettings(): ChatSettings {
  if (typeof window === "undefined") {
    return defaultSettings
  }

  try {
    const raw = window.localStorage.getItem(CHAT_SETTINGS_KEY)
    if (!raw) {
      return defaultSettings
    }

    const parsed = JSON.parse(raw) as Partial<ChatSettings>
    return {
      model: parsed.model === "gpt-4o" ? "gpt-4o" : "gpt-4o-mini",
      openAIApiKey: typeof parsed.openAIApiKey === "string" ? parsed.openAIApiKey : "",
      openAIBaseURL: typeof parsed.openAIBaseURL === "string" ? parsed.openAIBaseURL : "",
    }
  } catch {
    return defaultSettings
  }
}

function saveSettings(settings: ChatSettings) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings))
}

function toStreamInput(messages: ChatMessage[], settings: ChatSettings) {
  const baseURL = settings.openAIBaseURL.trim()
  const apiKey = settings.openAIApiKey.trim()

  return {
    model: settings.model,
    openAIApiKey: apiKey || undefined,
    openAIBaseURL: baseURL || undefined,
    messages: messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
    })),
  }
}

async function runAssistantStream(
  messages: ChatMessage[],
  settings: ChatSettings,
  requestId: number,
  abortController: AbortController
) {
  const stream = await client.chat.stream(toStreamInput(messages, settings), {
    signal: abortController.signal,
  })

  useChatStore.setState({ status: "streaming", abortController })

  for await (const event of stream) {
    const state = useChatStore.getState()
    if (state.requestId !== requestId) {
      return
    }

    if (event.type === "delta") {
      useChatStore.setState((current) => {
        const nextMessages = [...current.messages]
        const lastMessage = nextMessages[nextMessages.length - 1]

        if (!lastMessage || lastMessage.role !== "assistant") {
          return current
        }

        nextMessages[nextMessages.length - 1] = {
          ...lastMessage,
          content: `${lastMessage.content}${event.text}`,
        }

        return {
          ...current,
          messages: nextMessages,
        }
      })
    }

    if (event.type === "done") {
      useChatStore.setState((current) => {
        if (current.requestId !== requestId) {
          return current
        }

        return {
          ...current,
          status: "ready",
          abortController: null,
          error: null,
        }
      })
      return
    }
  }

  useChatStore.setState((current) => {
    if (current.requestId !== requestId) {
      return current
    }

    return {
      ...current,
      status: "ready",
      abortController: null,
    }
  })
}

export const useChatStore = create<ChatState>((set, get) => ({
  ...loadSettings(),
  input: "",
  messages: [],
  status: "ready",
  error: null,
  requestId: 0,
  abortController: null,

  setInput: (value) => set({ input: value }),

  setModel: (value) => {
    set({ model: value })
    const current = get()
    saveSettings({
      model: value,
      openAIApiKey: current.openAIApiKey,
      openAIBaseURL: current.openAIBaseURL,
    })
  },

  setOpenAIApiKey: (value) => {
    set({ openAIApiKey: value })
    const current = get()
    saveSettings({
      model: current.model,
      openAIApiKey: value,
      openAIBaseURL: current.openAIBaseURL,
    })
  },

  setOpenAIBaseURL: (value) => {
    set({ openAIBaseURL: value })
    const current = get()
    saveSettings({
      model: current.model,
      openAIApiKey: current.openAIApiKey,
      openAIBaseURL: value,
    })
  },

  stop: () => {
    const { abortController, status } = get()
    if (!abortController || (status !== "submitted" && status !== "streaming")) {
      return
    }

    abortController.abort()
    set({ status: "ready", abortController: null })
  },

  clearConversation: () => {
    const { abortController } = get()
    abortController?.abort()

    set({
      input: "",
      messages: [],
      status: "ready",
      error: null,
      abortController: null,
    })
  },

  sendMessage: async () => {
    const { input, model, openAIApiKey, openAIBaseURL, status } = get()
    const text = input.trim()

    if (!text || (status !== "ready" && status !== "error")) {
      return
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    }

    const assistantMessage: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
    }

    const baseMessages = [...get().messages, userMessage, assistantMessage]
    const requestId = get().requestId + 1
    const abortController = new AbortController()

    set({
      input: "",
      error: null,
      status: "submitted",
      messages: baseMessages,
      requestId,
      abortController,
    })

    try {
      await runAssistantStream(
        baseMessages,
        { model, openAIApiKey, openAIBaseURL },
        requestId,
        abortController
      )
    } catch (error) {
      if (abortController.signal.aborted) {
        return
      }

      set((current) => {
        if (current.requestId !== requestId) {
          return current
        }

        return {
          ...current,
          status: "error",
          abortController: null,
          error: error instanceof Error ? error.message : "Chat request failed",
        }
      })
    }
  },

  regenerate: async () => {
    const { messages, model, openAIApiKey, openAIBaseURL, status } = get()

    if (messages.length === 0 || (status !== "ready" && status !== "error")) {
      return
    }

    const lastAssistantIndex = [...messages]
      .map((message) => message.role)
      .lastIndexOf("assistant")

    if (lastAssistantIndex < 0) {
      return
    }

    const history = messages.slice(0, lastAssistantIndex)
    const assistantMessage: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
    }

    const requestMessages = [...history, assistantMessage]
    const requestId = get().requestId + 1
    const abortController = new AbortController()

    set({
      status: "submitted",
      error: null,
      messages: requestMessages,
      requestId,
      abortController,
    })

    try {
      await runAssistantStream(
        requestMessages,
        { model, openAIApiKey, openAIBaseURL },
        requestId,
        abortController
      )
    } catch (error) {
      if (abortController.signal.aborted) {
        return
      }

      set((current) => {
        if (current.requestId !== requestId) {
          return current
        }

        return {
          ...current,
          status: "error",
          abortController: null,
          error: error instanceof Error ? error.message : "Failed to regenerate",
        }
      })
    }
  },
}))
