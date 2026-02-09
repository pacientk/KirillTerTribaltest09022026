import { useEffect, useRef, useState } from 'react'
import { MessageListProps, MessageItemProps } from './types'
import './styles.css'

function hasCodeBlock(content: string): boolean {
  return /```(?:tsx?|jsx?|javascript)/.test(content)
}

function MessageItem({ message, onSelectPreview, isSelected }: MessageItemProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  const showActions = !isUser && hasCodeBlock(message.content)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShowPreview = () => {
    onSelectPreview?.(message.id)
  }

  return (
    <div
      className={`message-item flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      data-testid={`message-${message.id}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : `bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm ${isSelected ? 'ring-2 ring-emerald-500' : ''}`
        }`}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="attachments mb-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="attachment">
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-[200px] max-h-[150px] rounded object-cover"
                  />
                ) : (
                  <div className="code-attachment bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                    📄 {attachment.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Action buttons for assistant messages with code */}
        {showActions && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copy message"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleShowPreview}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                isSelected
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title="Show in preview"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isSelected ? 'Showing' : 'Preview'}
            </button>
          </div>
        )}

        <div
          className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}
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
        <div className="empty-state flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p>No messages yet. Start a conversation!</p>
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
