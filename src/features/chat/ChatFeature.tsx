import { useChatController } from './hooks'
import {
  MessageList,
  MessageInput,
  FileUpload,
  ScreenshotCapture,
  UIPreview,
} from '../../components'
import type { OrchestratorProgress } from './orchestrator/types'

// Template prompts for dropdown menu
const TEMPLATE_PROMPTS = [
  { label: 'Navbar', prompt: 'Create a navigation bar', icon: '📱' },
  { label: 'Hero Section', prompt: 'Create a hero section', icon: '🎯' },
  { label: 'Features', prompt: 'Create a features section', icon: '✨' },
  { label: 'Card', prompt: 'Create a card component', icon: '🃏' },
  { label: 'Form', prompt: 'Create a contact form', icon: '📝' },
  { label: 'Button', prompt: 'Create button variants', icon: '🔘' },
  { label: 'Modal', prompt: 'Create a modal dialog', icon: '💬' },
  { label: 'Table', prompt: 'Create a data table', icon: '📊' },
  { label: 'Sidebar', prompt: 'Create a sidebar menu', icon: '📑' },
  { label: 'Pricing', prompt: 'Create a pricing section', icon: '💰' },
  { label: 'Testimonials', prompt: 'Create testimonials section', icon: '⭐' },
  { label: 'Footer', prompt: 'Create a footer', icon: '🔻' },
]

const statusIcons: Record<string, string> = {
  planning: '🔍',
  executing: '⚡',
  aggregating: '📦',
  completed: '✅',
  failed: '❌',
}

interface ChatHeaderProps {
  orchestratorProgress: OrchestratorProgress | null
  onClearChat: () => void
  hasMessages: boolean
}

function ChatHeader({ orchestratorProgress, onClearChat, hasMessages }: ChatHeaderProps) {
  return (
    <div className="chat-header flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-white">
          AI UI Builder
        </h1>
        {hasMessages && (
          <button
            type="button"
            onClick={onClearChat}
            className="p-2 rounded-lg text-white/70 hover:bg-white/20 transition-colors"
            title="Clear chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      {orchestratorProgress && (
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-lg">{statusIcons[orchestratorProgress.status]}</span>
            <span className="text-white text-sm font-medium capitalize">{orchestratorProgress.status}</span>
          </div>
          {orchestratorProgress.runningTasks.length > 0 && (
            <div className="flex gap-2">
              {orchestratorProgress.runningTasks.map(task => (
                <span key={task.id} className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                  {task.agentId.replace('-agent', '')}
                </span>
              ))}
            </div>
          )}
          {orchestratorProgress.totalTasks > 0 && (
            <div className="text-xs text-white/70">
              {orchestratorProgress.completedTasks}/{orchestratorProgress.totalTasks} tasks
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface PreviewHeaderProps {
  previewHistoryLength: number
  currentPreviewIndex: number
  currentPreviewLabel: string | null
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

function PreviewHeader({
  previewHistoryLength,
  currentPreviewIndex,
  currentPreviewLabel,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: PreviewHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-500 to-teal-600">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          UI Preview
        </h2>
        {previewHistoryLength > 0 && (
          <div className="flex items-center gap-2">
            {/* Undo button */}
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous (Undo)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
            </button>

            {/* History indicator */}
            <span className="text-white/90 text-sm font-medium min-w-[60px] text-center">
              {currentPreviewIndex + 1} / {previewHistoryLength}
            </span>

            {/* Redo button */}
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next (Redo)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {currentPreviewLabel && (
        <div className="mt-1 text-white/70 text-sm">
          {currentPreviewLabel}
        </div>
      )}
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
      <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 text-center mb-2">
        No preview yet
      </p>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Ask the AI to create a component and the generated code will appear here
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          📱 navbar
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          🔘 button
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          🃏 card
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          📝 form
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          💬 modal
        </div>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          📊 table
        </div>
      </div>
    </div>
  )
}

export function ChatFeature() {
  const {
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
    toggleTemplates,
    setShowTemplates,
    clearMessages,
  } = useChatController()

  const handleTemplateSelect = (prompt: string) => {
    setDraft(prompt)
    setShowTemplates(false)
  }

  return (
    <div className="app min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <ChatHeader
            orchestratorProgress={orchestratorProgress}
            onClearChat={clearMessages}
            hasMessages={messages.length > 0}
          />

          <MessageList
            messages={messages}
            className="flex-1"
            onSelectPreview={selectPreview}
            selectedMessageId={currentPreview?.messageId}
          />

          {showUpload && (
            <div className="upload-section px-4 pb-2 space-y-2">
              <FileUpload onUpload={handleFileUpload} disabled={isProcessing} />
            </div>
          )}

          <div className="chat-footer border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-4 pt-3">
              <button
                type="button"
                onClick={toggleUpload}
                className={`p-2 rounded-lg transition-colors ${
                  showUpload
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label={showUpload ? 'Hide file upload' : 'Show file upload'}
                title="Attach files"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <ScreenshotCapture
                onCapture={handleScreenshot}
                disabled={isProcessing}
              />

              <div className="flex-1" />

              {/* Templates dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleTemplates()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    showTemplates
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Templates
                  <svg className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showTemplates && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">UI Components</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                      {TEMPLATE_PROMPTS.map((template) => (
                        <button
                          key={template.label}
                          type="button"
                          onClick={() => handleTemplateSelect(template.prompt)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <span className="text-base">{template.icon}</span>
                          <div>
                            <div className="font-medium">{template.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{template.prompt}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <MessageInput
              onSend={sendMessage}
              disabled={isProcessing}
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              placeholder="Describe the UI component you want..."
              value={draft}
              onChange={setDraft}
            />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-[500px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <PreviewHeader
            previewHistoryLength={previewHistory.length}
            currentPreviewIndex={currentPreviewIndex}
            currentPreviewLabel={currentPreview?.label ?? null}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />

          <div className="flex-1 overflow-auto p-4">
            {currentPreview ? (
              <UIPreview code={currentPreview.code} />
            ) : (
              <EmptyPreview />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
