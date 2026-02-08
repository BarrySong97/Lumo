import { Button } from "@lumo/ui";
import { PanelLeft, Plus, Settings } from "lucide-react";

type ChatHeaderProps = {
  onOpenHistory: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
};

export function ChatHeader({
  onOpenHistory,
  onNewChat,
  onOpenSettings,
}: ChatHeaderProps) {
  return (
    <header
      className="relative flex h-14 items-center justify-between border-b border-black/[0.08] px-5 dark:border-white/[0.08]"
      data-tauri-drag-region
    >
      <div className="flex items-center gap-1.5">
        <Button
          aria-label="Open history"
          className="text-muted-foreground"
          data-tauri-no-drag-region
          onClick={onOpenHistory}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <PanelLeft className="size-4" />
        </Button>

        <Button
          aria-label="New chat"
          className="text-muted-foreground"
          data-tauri-no-drag-region
          onClick={onNewChat}
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
        data-tauri-no-drag-region
        onClick={onOpenSettings}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Settings className="size-4" />
      </Button>
    </header>
  );
}
