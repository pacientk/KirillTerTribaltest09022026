import { useState, useCallback } from 'react'
import { Message, Status, FileUploadResult, Attachment } from '../types'
import { sendMessage } from '../services/api'

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

export interface UseChatReturn {
  messages: Message[]
  status: Status
  error: string | null
  send: (content: string, attachments?: FileUploadResult[]) => Promise<void>
  clear: () => void
  setStatus: (status: Status) => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(
    async (content: string, attachments?: FileUploadResult[]) => {
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        attachments: attachments?.map(fileToAttachment),
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setStatus('loading')
      setError(null)

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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        setStatus('error')
        console.error('Chat error:', err)
      }
    },
    [messages]
  )

  const clear = useCallback(() => {
    setMessages([])
    setStatus('idle')
    setError(null)
  }, [])

  return {
    messages,
    status,
    error,
    send,
    clear,
    setStatus,
  }
}
