import { useState, useRef, KeyboardEvent } from 'react'
import { SendHorizonal, X } from 'lucide-react'
import { MessageInputProps } from './types'
import './styles.css'

export function MessageInput({
  onSend,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
  className = '',
  attachments = [],
  onAttachmentsChange,
  value: controlledValue,
  onChange: controlledOnChange,
}: MessageInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Use controlled value if provided, otherwise use internal state
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  const setValue = isControlled ? (controlledOnChange || (() => {})) : setInternalValue

  const handleSend = () => {
    const trimmed = value.trim()
    if (trimmed || attachments.length > 0) {
      onSend(trimmed, attachments.length > 0 ? attachments : undefined)
      if (isControlled) {
        controlledOnChange?.('')
      } else {
        setInternalValue('')
      }
      onAttachmentsChange?.([])
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) to send
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
      return
    }
    // Enter without modifiers also sends (except Shift for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onTyping?.()

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    onAttachmentsChange?.(newAttachments)
  }

  return (
    <div className={`message-input p-4 ${className}`}>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="relative rounded-lg p-2 flex items-center gap-2"
              style={{ background: 'hsl(var(--secondary))' }}
            >
              {attachment.type === 'image' ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <span className="text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                  {attachment.file.name}
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'hsl(var(--accent-red))', color: 'white' }}
                aria-label={`Remove ${attachment.file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'hsl(var(--secondary))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            '--tw-ring-color': 'hsl(var(--primary))',
          } as React.CSSProperties}
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || (!value.trim() && attachments.length === 0)}
          className="p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'hsl(var(--primary))',
            color: 'white',
          }}
          aria-label="Send message"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
