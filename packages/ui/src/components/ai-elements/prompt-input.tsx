import * as React from "react"
import { ArrowUp, Loader2, Square } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

type PromptInputStatus = "ready" | "submitted" | "streaming" | "error"

type PromptInputProps = React.ComponentProps<"form">

export function PromptInput({ className, ...props }: PromptInputProps) {
  return <form className={cn("relative", className)} {...props} />
}

type PromptInputTextareaProps = React.ComponentProps<typeof Textarea>

export function PromptInputTextarea({ className, onKeyDown, ...props }: PromptInputTextareaProps) {
  return (
    <Textarea
      className={cn("min-h-[56px] resize-none rounded-xl pr-12", className)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault()
          const form = event.currentTarget.form
          form?.requestSubmit()
        }
        onKeyDown?.(event)
      }}
      {...props}
    />
  )
}

type PromptInputSubmitProps = Omit<React.ComponentProps<typeof Button>, "children" | "type"> & {
  status?: PromptInputStatus
  onStop?: () => void
}

export function PromptInputSubmit({
  className,
  disabled,
  onStop,
  status = "ready",
  ...props
}: PromptInputSubmitProps) {
  const isStreaming = status === "streaming" || status === "submitted"

  if (isStreaming && onStop) {
    return (
      <Button
        aria-label="Stop generation"
        className={cn("h-9 w-9 rounded-lg", className)}
        onClick={onStop}
        size="icon"
        type="button"
        variant="secondary"
        {...props}
      >
        <Square className="size-4" />
      </Button>
    )
  }

  return (
    <Button
      aria-label="Send message"
      className={cn("h-9 w-9 rounded-lg", className)}
      disabled={disabled || isStreaming}
      size="icon"
      type="submit"
      {...props}
    >
      {status === "submitted" ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
    </Button>
  )
}
