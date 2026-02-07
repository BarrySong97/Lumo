import type { z } from "zod"

import type {
  ChatMessageSchema,
  ChatRoleSchema,
  ChatStreamEventSchema,
  ChatStreamInputSchema,
  OpenAIModelSchema,
} from "../schemas/chat"

export type ChatRole = z.infer<typeof ChatRoleSchema>
export type OpenAIModel = z.infer<typeof OpenAIModelSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
export type ChatStreamInput = z.infer<typeof ChatStreamInputSchema>
export type ChatStreamEvent = z.infer<typeof ChatStreamEventSchema>
