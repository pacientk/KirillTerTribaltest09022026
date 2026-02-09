import { FileUploadResult } from '../../types'

export interface MessageInputProps {
  onSend: (message: string, attachments?: FileUploadResult[]) => void
  onTyping?: () => void
  disabled?: boolean
  placeholder?: string
  className?: string
  attachments?: FileUploadResult[]
  onAttachmentsChange?: (attachments: FileUploadResult[]) => void
  // Controlled mode
  value?: string
  onChange?: (value: string) => void
}
