import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
  cn,
} from "@lumo/ui";
import { Bot, Copy, RefreshCcw } from "lucide-react";

import type { ChatMessage, ChatStatus } from "@/stores/chatStore";

type MessageListProps = {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  currentTime: string;
  canRegenerate: boolean;
  onRegenerate: () => void;
};

export function MessageList({
  messages,
  status,
  error,
  currentTime,
  canRegenerate,
  onRegenerate,
}: MessageListProps) {
  return (
    <Conversation className="flex-1 rounded-none border-0 bg-transparent">
      <ConversationContent className="max-w-none gap-5 px-0 pb-4 pt-5">
        {messages.length === 0 ? (
          <ConversationEmptyState className="min-h-[340px]">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot className="size-4" />
              </div>
              <p className="text-lg font-medium">
                Hello. I am ready to assist you with your tasks today.
              </p>
              <p className="text-muted-foreground text-sm">How can I help?</p>
            </div>
          </ConversationEmptyState>
        ) : (
          <>
            <p className="text-muted-foreground mx-auto rounded-full border border-black/[0.06] bg-black/[0.03] px-3 py-1 text-xs dark:border-white/[0.08] dark:bg-white/[0.05]">
              Today, {currentTime}
            </p>

            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const isLastAssistant =
                isAssistant && index === messages.length - 1;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isAssistant ? "justify-start" : "justify-end",
                  )}
                >
                  {isAssistant && (
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Bot className="size-3.5" />
                    </div>
                  )}

                  <Message className="max-w-[86%]" from={message.role}>
                    <MessageContent
                      className={cn(
                        isAssistant ? "space-y-2" : "space-y-1",
                        isAssistant ? "bg-transparent px-0 py-0" : "",
                      )}
                    >
                      {isAssistant && (
                        <p className="text-[15px] font-semibold">Assistant</p>
                      )}
                      <MessageResponse className="text-[15px] leading-6">
                        {message.content ||
                          (status === "streaming" ? "..." : "")}
                      </MessageResponse>
                    </MessageContent>

                    {!isAssistant && index === messages.length - 1 && (
                      <p className="text-muted-foreground text-right text-xs">
                        Just now
                      </p>
                    )}

                    {isLastAssistant && (
                      <MessageActions>
                        <MessageAction
                          label="Regenerate"
                          disabled={!canRegenerate}
                          onClick={() => void onRegenerate()}
                        >
                          <RefreshCcw className="size-3.5" />
                        </MessageAction>

                        <MessageAction
                          label="Copy"
                          disabled={!message.content}
                          onClick={() => {
                            if (!message.content) {
                              return;
                            }

                            void navigator.clipboard.writeText(message.content);
                          }}
                        >
                          <Copy className="size-3.5" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Message>
                </div>
              );
            })}
          </>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
