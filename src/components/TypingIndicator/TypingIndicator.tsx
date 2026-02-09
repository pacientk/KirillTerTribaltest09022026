import { Bot } from 'lucide-react'

export interface TypingIndicatorProps {
  status?: string
}

const statusLabels: Record<string, string> = {
  planning: 'Planning...',
  executing: 'Generating...',
  aggregating: 'Finalizing...',
  completed: 'Done',
  failed: 'Error',
}

export function TypingIndicator({ status }: TypingIndicatorProps) {
  const label = status ? statusLabels[status] || status : 'Thinking...'

  return (
    <div className="flex items-start gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'hsl(var(--secondary))' }}
      >
        <Bot className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
      </div>
      <div className="flex items-center gap-3">
        <div
          className="px-4 py-3 rounded-lg"
          style={{ background: 'hsl(var(--chat-assistant-bg))' }}
        >
          <div className="typing-indicator">
            <span />
            <span />
            <span />
          </div>
        </div>
        <span
          className="text-xs font-medium px-2 py-1 rounded-md"
          style={{
            background: 'hsl(var(--muted))',
            color: 'hsl(var(--primary))',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
