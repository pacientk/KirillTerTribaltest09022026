import { useChatStore } from './chatStore'

// Memoized selectors for accessing store state

export const useMessages = () => useChatStore((state) => state.messages)

export const useDraft = () => useChatStore((state) => state.draft)

export const useAttachments = () => useChatStore((state) => state.attachments)

export const useIsProcessing = () => useChatStore((state) => state.isProcessing)

export const useOrchestratorProgress = () => useChatStore((state) => state.orchestratorProgress)

export const usePreviewHistory = () => useChatStore((state) => state.previewHistory)

export const useCurrentPreviewIndex = () => useChatStore((state) => state.currentPreviewIndex)

export const useShowUpload = () => useChatStore((state) => state.showUpload)

export const useShowTemplates = () => useChatStore((state) => state.showTemplates)

// Derived selectors

export const useCurrentPreview = () => {
  const previewHistory = usePreviewHistory()
  const currentPreviewIndex = useCurrentPreviewIndex()

  if (currentPreviewIndex < 0 || currentPreviewIndex >= previewHistory.length) {
    return null
  }

  return previewHistory[currentPreviewIndex]
}

export const useCanUndo = () => {
  const currentPreviewIndex = useCurrentPreviewIndex()
  return currentPreviewIndex > 0
}

export const useCanRedo = () => {
  const previewHistory = usePreviewHistory()
  const currentPreviewIndex = useCurrentPreviewIndex()
  return currentPreviewIndex < previewHistory.length - 1
}

export const useHasAttachments = () => {
  const attachments = useAttachments()
  return attachments.length > 0
}

export const usePreviewCount = () => {
  const previewHistory = usePreviewHistory()
  return previewHistory.length
}
