import { useEffect, useRef, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, User, Copy, Check, Eye } from 'lucide-react'
import { MessageListProps, MessageItemProps } from './types'
import './styles.css'

interface CodeBlockProps {
  language: string
  code: string
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        <span className="language">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`copy-button ${copied ? 'copied' : ''}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre
        className="m-0 rounded-t-none rounded-b-lg overflow-hidden"
        style={{
          background: 'hsl(var(--code-bg))',
          border: '1px solid hsl(var(--code-border))',
          borderTop: 'none',
        }}
      >
        <code
          className="block p-4 text-xs overflow-x-auto"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: 'hsl(var(--foreground))',
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}

function hasCodeBlock(content: string): boolean {
  return /```(?:tsx?|jsx?|javascript)/.test(content)
}

function MessageItem({ message, onSelectPreview, isSelected }: MessageItemProps) {
  const isUser = message.role === 'user'
  const showActions = !isUser && hasCodeBlock(message.content)

  const handleShowPreview = () => {
    onSelectPreview?.(message.id)
  }

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
      data-testid={`message-${message.id}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: isUser ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
        }}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
        )}
      </div>

      {/* Message content */}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${isSelected ? 'ring-2 ring-green-500' : ''}`}
        style={{
          background: isUser ? 'hsl(var(--primary))' : 'hsl(var(--chat-assistant-bg))',
          color: isUser ? 'white' : 'hsl(var(--foreground))',
        }}
      >
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id}>
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-[200px] max-h-[150px] rounded object-cover"
                  />
                ) : (
                  <div
                    className="px-2 py-1 rounded text-xs"
                    style={{ background: 'hsl(var(--secondary))' }}
                  >
                    {attachment.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message text with markdown */}
        <div className="prose-chat">
          <ReactMarkdown
            components={{
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                const isCodeBlock = match || (typeof children === 'string' && children.includes('\n'))

                if (isCodeBlock && match) {
                  return (
                    <CodeBlock
                      language={match[1]}
                      code={String(children).replace(/\n$/, '')}
                    />
                  )
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => <>{children}</>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div
            className="flex items-center gap-2 mt-3 pt-3"
            style={{ borderTop: '1px solid hsl(var(--border))' }}
          >
            <button
              type="button"
              onClick={handleShowPreview}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                isSelected ? 'text-green-400' : ''
              }`}
              style={{
                color: isSelected ? 'hsl(var(--accent-green))' : 'hsl(var(--muted-foreground))',
              }}
              title="Show in preview"
            >
              <Eye className="w-3.5 h-3.5" />
              {isSelected ? 'Showing' : 'Preview'}
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div
          className="text-xs mt-2"
          style={{ color: isUser ? 'rgba(255,255,255,0.7)' : 'hsl(var(--muted-foreground))' }}
        >
          {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export function MessageList({ messages, className = '', onSelectPreview, selectedMessageId }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={containerRef}
      className={`message-list flex-1 overflow-y-auto p-4 ${className}`}
      role="log"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <Bot className="w-12 h-12 mb-4" style={{ color: 'hsl(var(--border))' }} />
          <p className="text-lg font-medium mb-1">No messages yet</p>
          <p className="text-sm">Start a conversation to generate UI components</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onSelectPreview={onSelectPreview}
            isSelected={message.id === selectedMessageId}
          />
        ))
      )}
    </div>
  )
}
