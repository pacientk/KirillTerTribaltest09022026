import { useState, useRef, KeyboardEvent } from 'react'
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
    <div className={`message-input border-t border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {attachments.length > 0 && (
        <div className="attachments-preview flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="attachment-preview relative bg-gray-100 dark:bg-gray-800 rounded p-2 flex items-center gap-2"
            >
              {attachment.type === 'image' ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <span className="text-sm">📄 {attachment.file.name}</span>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="remove-btn absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                aria-label={`Remove ${attachment.file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || (!value.trim() && attachments.length === 0)}
          className="send-btn px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
