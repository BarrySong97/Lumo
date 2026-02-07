import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lumo/ui";
import { Moon, Sun } from "lucide-react";

import type { OpenAIModel } from "@lumo/api";

type ChatFooterProps = {
  model: OpenAIModel;
  onModelChange: (value: OpenAIModel) => void;
  isDark: boolean;
  onToggleTheme: () => void;
};

const models = [
  { label: "GPT-4o mini", value: "gpt-4o-mini" },
  { label: "GPT-4o", value: "gpt-4o" },
];

export function ChatFooter({
  model,
  onModelChange,
  isDark,
  onToggleTheme,
}: ChatFooterProps) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <Select
        onValueChange={(value) => {
          if (value === "gpt-4o" || value === "gpt-4o-mini") {
            onModelChange(value);
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

      <Button onClick={onToggleTheme} size="icon-sm" type="button" variant="ghost">
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
    </div>
  );
}
