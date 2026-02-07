import { Button, Drawer, DrawerContent, ScrollArea, cn } from "@lumo/ui";
import { MessageSquare, Settings, Trash2, X } from "lucide-react";

const drawerWidth = "w-[min(390px,84vw)]";

type HistoryGroup = {
  label: string;
  items: string[];
};

type ChatHistoryDrawerProps = {
  open: boolean;
  groups: HistoryGroup[];
  onOpenChange: (open: boolean) => void;
  onOpenSettings: () => void;
  onClearHistory?: () => void;
};

export function ChatHistoryDrawer({
  open,
  groups,
  onOpenChange,
  onOpenSettings,
  onClearHistory,
}: ChatHistoryDrawerProps) {
  return (
    <Drawer
      direction="left"
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
    >
      <DrawerContent
        className={cn(
          "border-black/10 dark:border-white/10 fixed left-0 top-0 h-full border-r bg-card transition-transform duration-200 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
          drawerWidth,
        )}
      >
        <header className="flex h-[72px] items-center justify-between border-b border-black/[0.08] px-5 dark:border-white/[0.08]">
          <h2 className="text-lg font-semibold">History</h2>
          <Button onClick={() => onOpenChange(false)} size="icon-sm" type="button" variant="ghost">
            <X className="size-4" />
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-7 px-5 py-4">
            {groups.map((group, groupIndex) => (
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
            onClick={onClearHistory}
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
              onOpenChange(false);
              onOpenSettings();
            }}
            size="default"
            type="button"
            variant="ghost"
          >
            <Settings className="size-4" />
            Settings
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
