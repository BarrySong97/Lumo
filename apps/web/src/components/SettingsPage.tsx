import { useState } from "react";
import {
  Button,
  Input,
  Kbd,
  KbdGroup,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  cn,
} from "@lumo/ui";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { useTheme } from "@/hooks/useTheme";
import { useChatStore } from "@/stores/chatStore";

const CHAT_TEMPERATURE_KEY = "lumo.chat.temperature";

function loadTemperature() {
  if (typeof window === "undefined") {
    return 0.7;
  }

  const raw = window.localStorage.getItem(CHAT_TEMPERATURE_KEY);
  if (!raw) {
    return 0.7;
  }

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return 0.7;
  }

  return Math.min(1, Math.max(0, parsed));
}

function saveTemperature(value: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHAT_TEMPERATURE_KEY, value.toFixed(1));
}

export function SettingsPage() {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState(loadTemperature);
  const [showApiKey, setShowApiKey] = useState(false);
  const openAIApiKey = useChatStore((state) => state.openAIApiKey);
  const openAIBaseURL = useChatStore((state) => state.openAIBaseURL);
  const setOpenAIApiKey = useChatStore((state) => state.setOpenAIApiKey);
  const setOpenAIBaseURL = useChatStore((state) => state.setOpenAIBaseURL);
  const { isDark, toggleTheme } = useTheme();

  return (
    <section className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-[72px] items-center border-b border-black/[0.08] px-5 dark:border-white/[0.08]">
        <Button
          onClick={() => navigate({ to: "/" })}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="ml-2 text-[22px] font-semibold tracking-[0.06em]">
          Settings
        </h1>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 px-6 py-5">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.12em]">
              AI PROVIDERS
            </p>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value="openai">
                <SelectTrigger id="provider" className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="Choose provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  className="h-11 rounded-xl pr-10"
                  onChange={(event) => setOpenAIApiKey(event.target.value)}
                  placeholder="sk-..."
                  type={showApiKey ? "text" : "password"}
                  value={openAIApiKey}
                />
                <Button
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowApiKey((current) => !current)}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  {showApiKey ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Your key is stored locally on your device.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="base-url">Base URL</Label>
              <Input
                id="base-url"
                className="h-11 rounded-xl"
                onChange={(event) => setOpenAIBaseURL(event.target.value)}
                placeholder="https://api.openai.com/v1"
                value={openAIBaseURL}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-muted-foreground rounded-md border border-black/10 px-2 py-0.5 text-xs dark:border-white/10">
                  {temperature.toFixed(1)}
                </span>
              </div>

              <input
                id="temperature"
                className="accent-primary w-full"
                max={1}
                min={0}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setTemperature(value);
                  saveTemperature(value);
                }}
                step={0.1}
                type="range"
                value={temperature}
              />

              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.12em]">
              GLOBAL SHORTCUTS
            </p>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">Quick Summon</p>
                <p className="text-muted-foreground text-sm">
                  Toggle chat visibility instantly
                </p>
              </div>
              <KbdGroup className="rounded-xl border border-black/10 bg-black/[0.03] px-2 py-1 dark:border-white/10 dark:bg-white/[0.05]">
                <Kbd>Cmd</Kbd>
                <span className="text-muted-foreground text-xs">+</span>
                <Kbd>Shift</Kbd>
                <span className="text-muted-foreground text-xs">+</span>
                <Kbd>C</Kbd>
              </KbdGroup>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.12em]">
              APPEARANCE
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-muted-foreground text-sm">
                  Adjust interface for low light
                </p>
              </div>

              <button
                aria-checked={isDark}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full border border-black/[0.08] transition-colors dark:border-white/10",
                  isDark ? "bg-primary" : "bg-muted",
                )}
                onClick={toggleTheme}
                role="switch"
                type="button"
              >
                <span
                  className={cn(
                    "inline-block size-5 transform rounded-full bg-white shadow transition-transform",
                    isDark ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>
          </div>

          <footer className="text-muted-foreground border-t border-black/10 px-2 pb-1 pt-5 text-center text-xs dark:border-white/10">
            Vertical Chat v1.0.4 • Check for updates
          </footer>
        </div>
      </ScrollArea>
    </section>
  );
}
