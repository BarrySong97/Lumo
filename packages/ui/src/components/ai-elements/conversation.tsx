import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

type ConversationContextValue = {
  isAtBottom: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

const ConversationContext = React.createContext<ConversationContextValue | null>(null)

type ConversationProps = React.ComponentProps<"div">

export function Conversation({ className, children, ...props }: ConversationProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)

  const updateScrollState = React.useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    const distanceToBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    setIsAtBottom(distanceToBottom < 16)
  }, [])

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior,
    })
  }, [])

  React.useEffect(() => {
    updateScrollState()
    if (isAtBottom) {
      scrollToBottom("auto")
    }
  }, [children, isAtBottom, scrollToBottom, updateScrollState])

  return (
    <ConversationContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div className={cn("relative flex-1 overflow-hidden rounded-lg border bg-card", className)} {...props}>
        <div ref={viewportRef} className="h-full overflow-y-auto" onScroll={updateScrollState}>
          {children}
        </div>
      </div>
    </ConversationContext.Provider>
  )
}

type ConversationContentProps = React.ComponentProps<"div">

export function ConversationContent({ className, ...props }: ConversationContentProps) {
  return <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-3 p-4", className)} {...props} />
}

type ConversationEmptyStateProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function ConversationEmptyState({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center gap-3 px-4 text-center",
        className
      )}
      {...props}
    >
      {icon}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}

type ConversationScrollButtonProps = React.ComponentProps<typeof Button>

export function ConversationScrollButton({ className, ...props }: ConversationScrollButtonProps) {
  const context = React.useContext(ConversationContext)

  if (!context || context.isAtBottom) {
    return null
  }

  return (
    <Button
      aria-label="Scroll to bottom"
      className={cn("absolute bottom-3 right-3 z-10", className)}
      onClick={() => context.scrollToBottom()}
      size="icon"
      type="button"
      variant="secondary"
      {...props}
    >
      <ChevronDown className="size-4" />
    </Button>
  )
}
