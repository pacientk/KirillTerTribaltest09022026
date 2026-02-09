import { useState, useCallback } from 'react'
import { ChatProps } from './types'
import { MessageList } from '../MessageList'
import { MessageInput } from '../MessageInput'
import { StatusIndicator } from '../StatusIndicator'
import { FileUpload } from '../FileUpload'
import { Message, Status, FileUploadResult, Attachment } from '../../types'
import { sendMessage } from '../../services/api'
import './styles.css'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function fileToAttachment(file: FileUploadResult): Attachment {
  return {
    id: generateId(),
    name: file.file.name,
    type: file.type,
    mimeType: file.file.type,
    url: file.preview,
    content: file.type === 'code' ? file.preview : undefined,
  }
}

export function Chat({ className = '' }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [attachments, setAttachments] = useState<FileUploadResult[]>([])
  const [showUpload, setShowUpload] = useState(false)

  const handleSend = useCallback(
    async (content: string, messageAttachments?: FileUploadResult[]) => {
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        attachments: messageAttachments?.map(fileToAttachment),
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setStatus('loading')
      setAttachments([])
      setShowUpload(false)

      try {
        const response = await sendMessage(messages, userMessage)

        setStatus('generating')

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response,
          createdAt: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setStatus('success')

        setTimeout(() => setStatus('idle'), 2000)
      } catch (error) {
        setStatus('error')
        console.error('Failed to send message:', error)
      }
    },
    [messages]
  )

  const handleTyping = useCallback(() => {
    if (status === 'idle' || status === 'success') {
      setStatus('typing')
    }
  }, [status])

  const handleFileUpload = useCallback((files: FileUploadResult[]) => {
    setAttachments((prev) => [...prev, ...files])
  }, [])

  const handleAttachmentsChange = useCallback((newAttachments: FileUploadResult[]) => {
    setAttachments(newAttachments)
  }, [])

  return (
    <div
      className={`chat flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="chat-header flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI UI Builder Chat
        </h1>
        <StatusIndicator status={status} />
      </div>

      <MessageList messages={messages} className="flex-1" />

      {showUpload && (
        <div className="upload-section px-4 pb-2">
          <FileUpload onUpload={handleFileUpload} disabled={status === 'loading'} />
        </div>
      )}

      <div className="chat-footer">
        <div className="flex items-center gap-2 px-4 pt-2">
          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            className={`attachment-toggle p-2 rounded-lg transition-colors ${
              showUpload
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={showUpload ? 'Hide file upload' : 'Show file upload'}
            aria-expanded={showUpload}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
        </div>

        <MessageInput
          onSend={handleSend}
          onTyping={handleTyping}
          disabled={status === 'loading' || status === 'generating'}
          attachments={attachments}
          onAttachmentsChange={handleAttachmentsChange}
        />
      </div>
    </div>
  )
}
