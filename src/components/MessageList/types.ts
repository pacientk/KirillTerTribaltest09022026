import { Message } from '../../types'

export interface MessageListProps {
  messages: Message[]
  className?: string
  onSelectPreview?: (messageId: string) => void
  selectedMessageId?: string
}

export interface MessageItemProps {
  message: Message
  onSelectPreview?: (messageId: string) => void
  isSelected?: boolean
}
