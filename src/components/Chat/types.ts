import { Message, Status } from '../../types'

export interface ChatProps {
  className?: string
}

export interface ChatState {
  messages: Message[]
  status: Status
  error: string | null
}
