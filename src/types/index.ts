export type Status = 'idle' | 'typing' | 'loading' | 'generating' | 'error' | 'success'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
  createdAt: Date
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'code'
  mimeType: string
  url: string
  content?: string
}

export interface FileUploadResult {
  file: File
  preview: string
  type: 'image' | 'code'
}

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml']
export const ALLOWED_CODE_EXTENSIONS = ['.tsx', '.ts', '.json', '.css']

// Re-export orchestrator and agent types for convenience
export type { OrchestratorProgress, OrchestratorResponse } from '../orchestrator/types'
export type { AgentType, AgentConfig } from '../agents/types'
