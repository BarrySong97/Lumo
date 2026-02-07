import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { ChatFooter } from "@/components/chatbot/ChatFooter";
import { ChatHeader } from "@/components/chatbot/ChatHeader";
import { ChatHistoryDrawer } from "@/components/chatbot/ChatHistoryDrawer";
import { ChatInput } from "@/components/chatbot/ChatInput";
import { MessageList } from "@/components/chatbot/MessageList";
import { useTheme } from "@/hooks/useTheme";
import { useChatStore } from "@/stores/chatStore";

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
        <ChatHeader
          onNewChat={clearConversation}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenSettings={() => navigate({ to: "/settings" })}
        />

        <MessageList
          canRegenerate={canRegenerate}
          currentTime={currentTime}
          error={error}
          messages={messages}
          onRegenerate={() => void regenerate()}
          status={status}
        />

        <div className="border-t border-black/[0.08] px-4 pb-4 pt-3 dark:border-white/[0.08]">
          <ChatInput
            canSend={canSend}
            input={input}
            onInputChange={setInput}
            onStop={stop}
            onSubmit={() => void sendMessage()}
            status={status}
          />

          <ChatFooter
            isDark={isDark}
            model={model}
            onModelChange={setModel}
            onToggleTheme={toggleTheme}
          />
        </div>
      </div>

      <ChatHistoryDrawer
        groups={historyGroups}
        onOpenChange={setHistoryOpen}
        onOpenSettings={() => navigate({ to: "/settings" })}
        open={historyOpen}
      />
    </div>
  );
}
