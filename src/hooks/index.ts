// Re-export from new location for backward compatibility
export { useFileUpload } from '../features/chat/hooks/useFileUpload'
export type { UseFileUploadReturn } from '../features/chat/hooks/useFileUpload'

export { useScreenshot } from '../features/chat/hooks/useScreenshot'
export type { UseScreenshotReturn } from '../features/chat/hooks/useScreenshot'

export { useOrchestrator } from '../features/chat/hooks/useOrchestrator'

// Legacy exports (keeping for now, can be removed later)
export { useChat } from './useChat'
