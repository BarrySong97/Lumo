import { Button, Conversation, ConversationContent, cn } from "@lumo/ui";
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
      <ConversationContent className="max-w-none gap-5 px-5 pb-4 pt-5">
        {messages.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Bot className="size-4" />
            </div>
            <p className="text-lg font-medium">
              Hello. I am ready to assist you with your tasks today.
            </p>
            <p className="text-muted-foreground text-sm">How can I help?</p>
          </div>
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

                  <div
                    className={cn(
                      "max-w-[86%]",
                      isAssistant ? "space-y-2" : "space-y-1",
                    )}
                  >
                    {isAssistant && (
                      <p className="text-[15px] font-semibold">Assistant</p>
                    )}

                    <div
                      className={cn(
                        "whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-6",
                        isAssistant
                          ? "bg-transparent px-0 py-0"
                          : "border border-black/[0.07] bg-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.09]",
                      )}
                    >
                      {message.content || (status === "streaming" ? "..." : "")}
                    </div>

                    {!isAssistant && index === messages.length - 1 && (
                      <p className="text-muted-foreground text-right text-xs">
                        Just now
                      </p>
                    )}

                    {isLastAssistant && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          className="text-muted-foreground"
                          disabled={!canRegenerate}
                          onClick={() => void onRegenerate()}
                          size="icon-xs"
                          type="button"
                          variant="ghost"
                        >
                          <RefreshCcw className="size-3.5" />
                        </Button>

                        <Button
                          className="text-muted-foreground"
                          disabled={!message.content}
                          onClick={() => {
                            if (!message.content) {
                              return;
                            }

                            void navigator.clipboard.writeText(message.content);
                          }}
                          size="icon-xs"
                          type="button"
                          variant="ghost"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
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
    </Conversation>
  );
}
