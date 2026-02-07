import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

type MessageRole = "user" | "assistant" | "system"

type MessageProps = React.ComponentProps<"div"> & {
  from: MessageRole
}

export function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      className={cn(
        "group/message flex w-full",
        from === "user" ? "justify-end" : "justify-start",
        className
      )}
      data-role={from}
      {...props}
    />
  )
}

type MessageContentProps = React.ComponentProps<"div">

export function MessageContent({ className, ...props }: MessageContentProps) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-xl px-4 py-3 text-sm",
        "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground",
        "group-data-[role=assistant]/message:bg-muted group-data-[role=assistant]/message:text-foreground",
        "group-data-[role=system]/message:bg-card group-data-[role=system]/message:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type MessageResponseProps = React.ComponentProps<"div">

export function MessageResponse({ className, ...props }: MessageResponseProps) {
  return <div className={cn("whitespace-pre-wrap break-words leading-6", className)} {...props} />
}

type MessageActionsProps = React.ComponentProps<"div">

export function MessageActions({ className, ...props }: MessageActionsProps) {
  return <div className={cn("mt-1 flex items-center gap-1", className)} {...props} />
}

type MessageActionProps = React.ComponentProps<typeof Button> & {
  label: string
}

export function MessageAction({ className, label, ...props }: MessageActionProps) {
  return (
    <Button
      aria-label={label}
      className={cn("h-7 w-7", className)}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    />
  )
}
