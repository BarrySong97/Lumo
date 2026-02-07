import { z } from "zod"
import { eventIterator } from "@orpc/contract"

export const ChatRoleSchema = z.enum(["system", "user", "assistant"])

export const OpenAIModelSchema = z.enum(["gpt-4o-mini", "gpt-4o"])

export const ChatMessageSchema = z.object({
  id: z.string().min(1),
  role: ChatRoleSchema,
  content: z.string(),
})

export const ChatStreamInputSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  model: OpenAIModelSchema.optional(),
  openAIApiKey: z.string().min(1).optional(),
  openAIBaseURL: z.string().url().optional(),
})

export const ChatStreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("delta"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("done"),
  }),
])

export const ChatStreamOutputSchema = eventIterator(ChatStreamEventSchema)
