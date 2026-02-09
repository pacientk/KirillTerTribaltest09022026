// Re-export from new location for backward compatibility
export type {
  Message,
  MessageRole,
  Status,
  Attachment,
  FileUploadResult,
  Conversation,
  PreviewHistoryItem,
} from '../features/chat/models'

export {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_CODE_EXTENSIONS,
} from '../features/chat/models'

// Re-export orchestrator and agent types for convenience
export type { OrchestratorProgress, OrchestratorResponse } from '../features/chat/orchestrator/types'
export type { AgentType, AgentConfig } from '../features/chat/agents/types'
