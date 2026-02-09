import type { Message } from './message'

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface PreviewHistoryItem {
  messageId: string
  code: string
  label: string
}
