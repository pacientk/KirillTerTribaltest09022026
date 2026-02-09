import { useCallback } from 'react'
import { useChatStore } from '../store'
import type { Message, Attachment, FileUploadResult, PreviewHistoryItem } from '../models'
import type { OrchestratorProgress } from '../orchestrator/types'
import { useOrchestrator } from './useOrchestrator'

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

function extractCodeFromMessage(content: string): string | null {
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript|html|css)?\n([\s\S]*?)```/g
  const matches = [...content.matchAll(codeBlockRegex)]
  if (matches.length > 0) {
    return matches.map((m) => m[1].trim()).join('\n\n')
  }
  return null
}

function detectComponentLabel(code: string): string {
  const lower = code.toLowerCase()
  if (lower.includes('navbar') || lower.includes('<nav')) return 'Navbar'
  if (lower.includes('form') || lower.includes('<form')) return 'Form'
  if (lower.includes('card')) return 'Card'
  if (lower.includes('buttonshowcase') || (lower.includes('button') && lower.includes('variant'))) return 'Buttons'
  if (lower.includes('modal') || lower.includes('backdrop')) return 'Modal'
  if (lower.includes('table') || lower.includes('<th')) return 'Table'
  if (lower.includes('hero')) return 'Hero'
  if (lower.includes('sidebar') || lower.includes('side menu')) return 'Sidebar'
  if (lower.includes('pricing') || lower.includes('plan')) return 'Pricing'
  if (lower.includes('footer')) return 'Footer'
  if (lower.includes('testimonial') || lower.includes('review')) return 'Testimonials'
  if (lower.includes('features')) return 'Features'
  return 'Component'
}

export interface UseChatControllerReturn {
  // State
  messages: Message[]
  draft: string
  attachments: FileUploadResult[]
  isProcessing: boolean
  orchestratorProgress: OrchestratorProgress | null
  previewHistory: PreviewHistoryItem[]
  currentPreviewIndex: number
  currentPreview: PreviewHistoryItem | null
  canUndo: boolean
  canRedo: boolean
  showUpload: boolean
  showTemplates: boolean

  // Actions
  setDraft: (draft: string) => void
  sendMessage: (content: string, messageAttachments?: FileUploadResult[]) => Promise<void>
  selectPreview: (messageId: string) => void
  undo: () => void
  redo: () => void
  handleFileUpload: (files: FileUploadResult[]) => void
  handleScreenshot: (screenshot: FileUploadResult) => void
  handleAttachmentsChange: (attachments: FileUploadResult[]) => void
  toggleUpload: () => void
  setShowUpload: (show: boolean) => void
  toggleTemplates: () => void
  setShowTemplates: (show: boolean) => void
}

export function useChatController(): UseChatControllerReturn {
  // Store state
  const messages = useChatStore((s) => s.messages)
  const draft = useChatStore((s) => s.draft)
  const attachments = useChatStore((s) => s.attachments)
  const isProcessing = useChatStore((s) => s.isProcessing)
  const orchestratorProgress = useChatStore((s) => s.orchestratorProgress)
  const previewHistory = useChatStore((s) => s.previewHistory)
  const currentPreviewIndex = useChatStore((s) => s.currentPreviewIndex)
  const showUpload = useChatStore((s) => s.showUpload)
  const showTemplates = useChatStore((s) => s.showTemplates)

  // Store actions
  const addMessage = useChatStore((s) => s.addMessage)
  const setDraft = useChatStore((s) => s.setDraft)
  const addAttachments = useChatStore((s) => s.addAttachments)
  const setAttachments = useChatStore((s) => s.setAttachments)
  const clearAttachments = useChatStore((s) => s.clearAttachments)
  const setProcessing = useChatStore((s) => s.setProcessing)
  const setOrchestratorProgress = useChatStore((s) => s.setOrchestratorProgress)
  const addPreview = useChatStore((s) => s.addPreview)
  const navigatePreview = useChatStore((s) => s.navigatePreview)
  const selectPreviewStore = useChatStore((s) => s.selectPreview)
  const toggleUpload = useChatStore((s) => s.toggleUpload)
  const setShowUpload = useChatStore((s) => s.setShowUpload)
  const toggleTemplates = useChatStore((s) => s.toggleTemplates)
  const setShowTemplates = useChatStore((s) => s.setShowTemplates)

  // Orchestrator hook
  const orchestrator = useOrchestrator({
    onProgress: setOrchestratorProgress,
  })

  // Computed values
  const currentPreview = currentPreviewIndex >= 0 ? previewHistory[currentPreviewIndex] : null
  const canUndo = currentPreviewIndex > 0
  const canRedo = currentPreviewIndex < previewHistory.length - 1

  // Actions
  const sendMessage = useCallback(
    async (content: string, messageAttachments?: FileUploadResult[]) => {
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        attachments: messageAttachments?.map(fileToAttachment),
        createdAt: new Date(),
      }

      addMessage(userMessage)
      setProcessing(true)
      clearAttachments()
      setShowUpload(false)
      setDraft('')

      try {
        // Convert FileUploadResult to Attachment for orchestrator
        const attachmentsForOrchestrator = messageAttachments?.map(fileToAttachment)

        const response = await orchestrator.execute(
          content,
          messages,
          attachmentsForOrchestrator
        )

        // Format the response content with code block if present
        let assistantContent = response.content
        if (response.code) {
          assistantContent += '\n\n```tsx\n' + response.code + '\n```'
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: assistantContent,
          createdAt: new Date(),
        }

        addMessage(assistantMessage)

        // Add to preview history
        const code = response.code || extractCodeFromMessage(assistantContent)
        if (code) {
          const newPreviewItem: PreviewHistoryItem = {
            messageId: assistantMessage.id,
            code,
            label: detectComponentLabel(code),
          }
          addPreview(newPreviewItem)
        }

        // Clear progress after a short delay
        setTimeout(() => setOrchestratorProgress(null), 1000)
      } catch (error) {
        console.error('Failed to send message:', error)
        setOrchestratorProgress({
          totalTasks: 0,
          completedTasks: 0,
          runningTasks: [],
          status: 'failed'
        })
      } finally {
        setProcessing(false)
      }
    },
    [
      messages,
      orchestrator,
      addMessage,
      setProcessing,
      clearAttachments,
      setShowUpload,
      setDraft,
      setOrchestratorProgress,
      addPreview,
    ]
  )

  const selectPreview = useCallback((messageId: string) => {
    selectPreviewStore(messageId)
  }, [selectPreviewStore])

  const undo = useCallback(() => {
    navigatePreview('prev')
  }, [navigatePreview])

  const redo = useCallback(() => {
    navigatePreview('next')
  }, [navigatePreview])

  const handleFileUpload = useCallback((files: FileUploadResult[]) => {
    addAttachments(files)
  }, [addAttachments])

  const handleScreenshot = useCallback((screenshot: FileUploadResult) => {
    addAttachments([screenshot])
  }, [addAttachments])

  const handleAttachmentsChange = useCallback((newAttachments: FileUploadResult[]) => {
    setAttachments(newAttachments)
  }, [setAttachments])

  return {
    // State
    messages,
    draft,
    attachments,
    isProcessing,
    orchestratorProgress,
    previewHistory,
    currentPreviewIndex,
    currentPreview,
    canUndo,
    canRedo,
    showUpload,
    showTemplates,

    // Actions
    setDraft,
    sendMessage,
    selectPreview,
    undo,
    redo,
    handleFileUpload,
    handleScreenshot,
    handleAttachmentsChange,
    toggleUpload,
    setShowUpload,
    toggleTemplates,
    setShowTemplates,
  }
}
