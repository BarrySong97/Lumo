import {
  Button,
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
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
  return (
    <PromptInput
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <PromptInputTextarea
        className="min-h-[96px] rounded-2xl border-black/10 bg-black/[0.03] px-4 py-3 pr-14 text-base leading-6 placeholder:text-black/35 dark:border-white/10 dark:bg-white/[0.06] dark:placeholder:text-white/35"
        onChange={(event) => onInputChange(event.currentTarget.value)}
        placeholder="Ask anything..."
        value={input}
      />

      <div className="text-muted-foreground absolute bottom-3 left-2.5 flex items-center gap-0.5">
        <Button className="rounded-md" size="icon-xs" type="button" variant="ghost">
          <Paperclip className="size-3.5" />
        </Button>
        <Button className="rounded-md" size="icon-xs" type="button" variant="ghost">
          <Sparkles className="size-3.5" />
        </Button>
        <Button className="rounded-md" size="icon-xs" type="button" variant="ghost">
          <Image className="size-3.5" />
        </Button>
        <Button className="rounded-md" size="icon-xs" type="button" variant="ghost">
          <Mic className="size-3.5" />
        </Button>
      </div>

      <PromptInputSubmit
        className="absolute bottom-3 right-3 rounded-xl"
        disabled={!canSend}
        onStop={onStop}
        status={status}
      />
    </PromptInput>
  );
}
