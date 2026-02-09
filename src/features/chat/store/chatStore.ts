import { create } from 'zustand'
import type { Message, FileUploadResult, PreviewHistoryItem } from '../models'
import type { OrchestratorProgress } from '../orchestrator/types'

interface ChatState {
  // Messages
  messages: Message[]

  // Input state
  draft: string
  attachments: FileUploadResult[]

  // Processing state
  isProcessing: boolean
  orchestratorProgress: OrchestratorProgress | null

  // Preview history
  previewHistory: PreviewHistoryItem[]
  currentPreviewIndex: number

  // UI state
  showUpload: boolean
  showTemplates: boolean
}

interface ChatActions {
  // Message actions
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  clearMessages: () => void

  // Input actions
  setDraft: (draft: string) => void
  addAttachment: (attachment: FileUploadResult) => void
  addAttachments: (attachments: FileUploadResult[]) => void
  removeAttachment: (index: number) => void
  setAttachments: (attachments: FileUploadResult[]) => void
  clearAttachments: () => void

  // Processing actions
  setProcessing: (isProcessing: boolean) => void
  setOrchestratorProgress: (progress: OrchestratorProgress | null) => void

  // Preview actions
  addPreview: (item: PreviewHistoryItem) => void
  navigatePreview: (direction: 'prev' | 'next') => void
  selectPreview: (messageId: string) => void

  // UI actions
  toggleUpload: () => void
  setShowUpload: (show: boolean) => void
  toggleTemplates: () => void
  setShowTemplates: (show: boolean) => void

  // Reset
  reset: () => void
}

type ChatStore = ChatState & ChatActions

const initialState: ChatState = {
  messages: [],
  draft: '',
  attachments: [],
  isProcessing: false,
  orchestratorProgress: null,
  previewHistory: [],
  currentPreviewIndex: -1,
  showUpload: false,
  showTemplates: false,
}

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // Message actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [], previewHistory: [], currentPreviewIndex: -1 }),

  // Input actions
  setDraft: (draft) => set({ draft }),

  addAttachment: (attachment) => set((state) => ({
    attachments: [...state.attachments, attachment]
  })),

  addAttachments: (attachments) => set((state) => ({
    attachments: [...state.attachments, ...attachments]
  })),

  removeAttachment: (index) => set((state) => ({
    attachments: state.attachments.filter((_, i) => i !== index)
  })),

  setAttachments: (attachments) => set({ attachments }),

  clearAttachments: () => set({ attachments: [] }),

  // Processing actions
  setProcessing: (isProcessing) => set({ isProcessing }),

  setOrchestratorProgress: (orchestratorProgress) => set({ orchestratorProgress }),

  // Preview actions
  addPreview: (item) => set((state) => ({
    previewHistory: [...state.previewHistory, item],
    currentPreviewIndex: state.previewHistory.length
  })),

  navigatePreview: (direction) => set((state) => {
    if (state.previewHistory.length === 0) return state

    const newIndex = direction === 'prev'
      ? Math.max(0, state.currentPreviewIndex - 1)
      : Math.min(state.previewHistory.length - 1, state.currentPreviewIndex + 1)

    return { currentPreviewIndex: newIndex }
  }),

  selectPreview: (messageId) => {
    const state = get()
    const index = state.previewHistory.findIndex(p => p.messageId === messageId)
    if (index >= 0) {
      set({ currentPreviewIndex: index })
    }
  },

  // UI actions
  toggleUpload: () => set((state) => ({ showUpload: !state.showUpload })),

  setShowUpload: (showUpload) => set({ showUpload }),

  toggleTemplates: () => set((state) => ({ showTemplates: !state.showTemplates })),

  setShowTemplates: (showTemplates) => set({ showTemplates }),

  // Reset
  reset: () => set(initialState),
}))
