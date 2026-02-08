import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@lumo/ui";
import { Image, Mic, Paperclip, Sparkles } from "lucide-react";

import type { ChatStatus } from "@/stores/chatStore";

type ChatInputProps = {
  input: string;
  canSend: boolean;
  status: ChatStatus;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
};

export function ChatInput({
  input,
  canSend,
  status,
  onInputChange,
  onSubmit,
  onStop,
}: ChatInputProps) {
  const canStop = status === "submitted" || status === "streaming";
  const submitDisabled = !canSend && !canStop;

  return (
    <PromptInput
      className="w-full"
      onSubmit={(message, event) => {
        event.preventDefault();
        if (!message.text.trim() || !canSend) {
          return;
        }
        onSubmit();
      }}
    >
      <PromptInputTextarea
        className="min-h-[96px] px-4 py-3 text-base leading-6 placeholder:text-black/35 dark:placeholder:text-white/35"
        onChange={(event) => onInputChange(event.currentTarget.value)}
        placeholder="Ask anything..."
        value={input}
      />

      <PromptInputFooter>
        <PromptInputTools className="text-muted-foreground">
          <PromptInputButton className="rounded-md">
            <Paperclip className="size-3.5" />
          </PromptInputButton>
          <PromptInputButton className="rounded-md">
            <Sparkles className="size-3.5" />
          </PromptInputButton>
          <PromptInputButton className="rounded-md">
            <Image className="size-3.5" />
          </PromptInputButton>
          <PromptInputButton className="rounded-md">
            <Mic className="size-3.5" />
          </PromptInputButton>
        </PromptInputTools>

        <PromptInputSubmit
          disabled={submitDisabled}
          onClick={(event) => {
            if (!canStop) {
              return;
            }
            event.preventDefault();
            onStop();
          }}
          status={status}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}
