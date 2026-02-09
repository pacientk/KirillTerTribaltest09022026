import type { Attachment } from './attachment'

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  attachments?: Attachment[]
  createdAt: Date
}

export type Status = 'idle' | 'typing' | 'loading' | 'generating' | 'error' | 'success'
