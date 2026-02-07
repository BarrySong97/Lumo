import { useMemo, useState } from "react";
import {
  Button,
  Conversation,
  ConversationContent,
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@lumo/ui";
import {
  Bot,
  Copy,
  Image,
  MessageSquare,
  Mic,
  Moon,
  Paperclip,
  PanelLeft,
  Plus,
  RefreshCcw,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { useTheme } from "@/hooks/useTheme";
import { useChatStore } from "@/stores/chatStore";

const models = [
  { label: "GPT-4o mini", value: "gpt-4o-mini" },
  { label: "GPT-4o", value: "gpt-4o" },
];

const historyGroups = [
  {
    label: "TODAY",
    items: ["Minimalist UI trends", "Tailwind configuration help"],
  },
  {
    label: "YESTERDAY",
    items: [
      "React performance tips",
      "Debug API connection",
      "CSS Grid layout examples",
    ],
  },
  {
    label: "LAST 7 DAYS",
    items: ["Weekend trip itinerary", "Gift ideas for mom", "Recipe for pasta"],
  },
];

export function Chatbot() {
  const navigate = useNavigate();
  const messages = useChatStore((state) => state.messages);
  const input = useChatStore((state) => state.input);
  const status = useChatStore((state) => state.status);
  const error = useChatStore((state) => state.error);
  const model = useChatStore((state) => state.model);
  const setModel = useChatStore((state) => state.setModel);
  const setInput = useChatStore((state) => state.setInput);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const stop = useChatStore((state) => state.stop);
  const regenerate = useChatStore((state) => state.regenerate);
  const clearConversation = useChatStore((state) => state.clearConversation);
  const { isDark, toggleTheme } = useTheme();
  const [historyOpen, setHistoryOpen] = useState(false);

  const canSend =
    input.trim().length > 0 && status !== "submitted" && status !== "streaming";
  const lastMessage = messages[messages.length - 1];
  const canRegenerate =
    (status === "ready" || status === "error") &&
    Boolean(lastMessage && lastMessage.role === "assistant");

  const currentTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
    [],
  );

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-card">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="relative flex h-[72px] items-center justify-between border-b border-black/[0.08] px-5 dark:border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            <Button
              aria-label="Open history"
              className="text-muted-foreground"
              onClick={() => setHistoryOpen(true)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <PanelLeft className="size-4" />
            </Button>

            <Button
              aria-label="New chat"
              className="text-muted-foreground"
              onClick={() => clearConversation()}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-[0.14em]">
            ASSISTANT
          </p>

          <Button
            aria-label="Open settings"
            className="text-muted-foreground"
            onClick={() => navigate({ to: "/settings" })}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Settings className="size-4" />
          </Button>
        </header>

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
                          {message.content ||
                            (status === "streaming" ? "..." : "")}
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
                              onClick={() => void regenerate()}
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

                                void navigator.clipboard.writeText(
                                  message.content,
                                );
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

        <div className="border-t border-black/[0.08] px-4 pb-4 pt-3 dark:border-white/[0.08]">
          <PromptInput
            className="w-full"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <PromptInputTextarea
              className="min-h-[96px] rounded-2xl border-black/10 bg-black/[0.03] px-4 py-3 pr-14 text-base leading-6 placeholder:text-black/35 dark:border-white/10 dark:bg-white/[0.06] dark:placeholder:text-white/35"
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Ask anything..."
              value={input}
            />

            <div className="text-muted-foreground absolute bottom-3 left-2.5 flex items-center gap-0.5">
              <Button
                className="rounded-md"
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Paperclip className="size-3.5" />
              </Button>
              <Button
                className="rounded-md"
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Sparkles className="size-3.5" />
              </Button>
              <Button
                className="rounded-md"
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Image className="size-3.5" />
              </Button>
              <Button
                className="rounded-md"
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Mic className="size-3.5" />
              </Button>
            </div>

            <PromptInputSubmit
              className="absolute bottom-3 right-3 rounded-xl"
              disabled={!canSend}
              onStop={stop}
              status={status}
            />
          </PromptInput>

          <div className="mt-3 flex items-center justify-between">
            <Select
              onValueChange={(value) => {
                if (value === "gpt-4o" || value === "gpt-4o-mini") {
                  setModel(value);
                }
              }}
              value={model}
            >
              <SelectTrigger className="h-8 w-[132px] rounded-xl border-black/10 bg-black/[0.03] text-sm dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <SelectValue placeholder="Choose model" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {models.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={toggleTheme}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              {isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 bg-black/10 opacity-0 transition-opacity",
          historyOpen && "pointer-events-auto opacity-100",
        )}
        onClick={() => setHistoryOpen(false)}
      />

      <aside
        className={cn(
          "absolute left-0 top-0 z-20 flex h-full w-[min(390px,84vw)] flex-col border-r border-black/10 bg-card",
          historyOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <header className="flex h-[72px] items-center justify-between border-b border-black/[0.08] px-5 dark:border-white/[0.08]">
          <h2 className="text-lg font-semibold">History</h2>
          <Button
            onClick={() => setHistoryOpen(false)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-7 px-5 py-4">
            {historyGroups.map((group, groupIndex) => (
              <div key={group.label} className="space-y-2.5">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.1em]">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => {
                    const isCurrent = groupIndex === 0 && itemIndex === 0;

                    return (
                      <button
                        key={item}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[15px] transition-colors",
                          isCurrent ? "bg-muted" : "hover:bg-muted/60",
                        )}
                        type="button"
                      >
                        {isCurrent && (
                          <MessageSquare className="text-muted-foreground size-4 shrink-0" />
                        )}
                        <span className="truncate">{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-black/[0.08] px-4 py-3 dark:border-white/[0.08]">
          <Button
            className="justify-start"
            size="default"
            type="button"
            variant="ghost"
          >
            <Trash2 className="size-4" />
            Clear all history
          </Button>
          <Button
            className="justify-start"
            onClick={() => {
              setHistoryOpen(false);
              navigate({ to: "/settings" });
            }}
            size="default"
            type="button"
            variant="ghost"
          >
            <Settings className="size-4" />
            Settings
          </Button>
        </div>
      </aside>
    </div>
  );
}
