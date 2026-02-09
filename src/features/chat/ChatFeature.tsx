import { useChatController } from './hooks'
import {
  MessageList,
  MessageInput,
  FileUpload,
  ScreenshotCapture,
  UIPreview,
  TypingIndicator,
} from '../../components'
import {
  Sparkles,
  Trash2,
  Paperclip,
  LayoutTemplate,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Monitor,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import type { OrchestratorProgress } from './orchestrator/types'

// Template prompts for dropdown menu
const TEMPLATE_PROMPTS = [
  { label: 'Navbar', prompt: 'Create a navigation bar' },
  { label: 'Hero Section', prompt: 'Create a hero section' },
  { label: 'Features', prompt: 'Create a features section' },
  { label: 'Card', prompt: 'Create a card component' },
  { label: 'Form', prompt: 'Create a contact form' },
  { label: 'Button', prompt: 'Create button variants' },
  { label: 'Modal', prompt: 'Create a modal dialog' },
  { label: 'Table', prompt: 'Create a data table' },
  { label: 'Sidebar', prompt: 'Create a sidebar menu' },
  { label: 'Pricing', prompt: 'Create a pricing section' },
  { label: 'Testimonials', prompt: 'Create testimonials section' },
  { label: 'Footer', prompt: 'Create a footer' },
]

interface ChatHeaderProps {
  orchestratorProgress: OrchestratorProgress | null
  onClearChat: () => void
  hasMessages: boolean
}

function ChatHeader({ orchestratorProgress, onClearChat, hasMessages }: ChatHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{
        borderBottom: '1px solid hsl(var(--border))',
        background: 'hsl(var(--secondary))',
      }}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
        <h1 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
          AI UI Builder
        </h1>
        {hasMessages && (
          <button
            type="button"
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors hover:opacity-80"
            style={{
              background: 'hsl(var(--muted))',
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
      {orchestratorProgress && orchestratorProgress.totalTasks > 0 && (
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-1 rounded-md"
            style={{
              background: 'hsl(var(--muted))',
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            {orchestratorProgress.completedTasks}/{orchestratorProgress.totalTasks} tasks
          </span>
        </div>
      )}
    </div>
  )
}

interface PreviewHeaderProps {
  previewHistoryLength: number
  currentPreviewIndex: number
  currentPreviewLabel: string | null
  currentPreviewCode: string | null
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

function PreviewHeader({
  previewHistoryLength,
  currentPreviewIndex,
  currentPreviewLabel,
  currentPreviewCode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: PreviewHeaderProps) {
  const [liked, setLiked] = useState<'up' | 'down' | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (currentPreviewCode) {
      await navigator.clipboard.writeText(currentPreviewCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLike = (type: 'up' | 'down') => {
    setLiked(liked === type ? null : type)
  }

  return (
    <div
      className="px-6 py-4"
      style={{
        borderBottom: '1px solid hsl(var(--border))',
        background: 'hsl(var(--secondary))',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            UI Preview
          </h2>
        </div>
        {previewHistoryLength > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                color: 'hsl(var(--muted-foreground))',
                background: canUndo ? 'hsl(var(--muted))' : 'transparent',
              }}
              title="Previous (Undo)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span
              className="text-sm font-medium min-w-[50px] text-center"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              {currentPreviewIndex + 1} / {previewHistoryLength}
            </span>

            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                color: 'hsl(var(--muted-foreground))',
                background: canRedo ? 'hsl(var(--muted))' : 'transparent',
              }}
              title="Next (Redo)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {previewHistoryLength > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Showing: {currentPreviewLabel || 'Component'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleLike('up')}
              className="p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{
                background: liked === 'up' ? 'hsl(var(--accent-green) / 0.2)' : 'hsl(var(--muted))',
                color: liked === 'up' ? 'hsl(var(--accent-green))' : 'hsl(var(--muted-foreground))',
              }}
              title="Like"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleLike('down')}
              className="p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{
                background: liked === 'down' ? 'hsl(var(--accent-red) / 0.2)' : 'hsl(var(--muted))',
                color: liked === 'down' ? 'hsl(var(--accent-red))' : 'hsl(var(--muted-foreground))',
              }}
              title="Dislike"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!currentPreviewCode}
              className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-lg transition-colors hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: copied ? 'hsl(var(--accent-green) / 0.2)' : 'hsl(var(--muted))',
                color: copied ? 'hsl(var(--accent-green))' : 'hsl(var(--muted-foreground))',
              }}
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div
        className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center"
        style={{ background: 'hsl(var(--secondary))' }}
      >
        <Monitor className="w-8 h-8" style={{ color: 'hsl(var(--border))' }} />
      </div>
      <p className="text-base font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>
        No preview yet
      </p>
      <p className="text-sm text-center max-w-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Ask the AI to create a component and it will appear here
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
        {['navbar', 'button', 'card', 'form', 'modal', 'table'].map((item) => (
          <div
            key={item}
            className="px-3 py-2 rounded-lg"
            style={{
              background: 'hsl(var(--secondary))',
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            {item}
          </div>
        ))}
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
    <div className="min-h-screen p-4" style={{ background: 'hsl(var(--background))' }}>
      <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
        {/* Left: Chat */}
        <div
          className="flex-1 flex flex-col rounded-xl overflow-hidden"
          style={{
            background: 'hsl(var(--secondary))',
            border: '1px solid hsl(var(--border))',
          }}
        >
          <ChatHeader
            orchestratorProgress={orchestratorProgress}
            onClearChat={clearMessages}
            hasMessages={messages.length > 0}
          />

          <div className="flex-1 overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
            <MessageList
              messages={messages}
              className="h-full"
              onSelectPreview={selectPreview}
              selectedMessageId={currentPreview?.messageId}
            />
          </div>

          {/* Typing indicator with status */}
          {isProcessing && (
            <div className="px-4 pb-2" style={{ background: 'hsl(var(--background))' }}>
              <TypingIndicator status={orchestratorProgress?.status} />
            </div>
          )}

          {showUpload && (
            <div
              className="px-4 pb-2 space-y-2"
              style={{ background: 'hsl(var(--background))' }}
            >
              <FileUpload onUpload={handleFileUpload} disabled={isProcessing} />
            </div>
          )}

          <div style={{ borderTop: '1px solid hsl(var(--border))' }}>
            <div
              className="flex items-center gap-2 p-4"
              style={{ background: 'hsl(var(--background))' }}
            >
              <button
                type="button"
                onClick={toggleUpload}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: showUpload ? 'hsl(var(--muted))' : 'transparent',
                  color: showUpload ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                }}
                aria-label={showUpload ? 'Hide file upload' : 'Show file upload'}
                title="Attach files"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <ScreenshotCapture
                onCapture={handleScreenshot}
                disabled={isProcessing}
              />

              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{
                  background: 'transparent',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                Any Action
              </button>

              <div className="flex-1" />

              {/* Templates dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleTemplates()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    background: showTemplates ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    color: showTemplates ? 'white' : 'hsl(var(--foreground))',
                  }}
                >
                  <LayoutTemplate className="w-5 h-5" />
                  Templates
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`}
                  />
                </button>

                {showTemplates && (
                  <div
                    className="absolute bottom-full right-0 mb-2 w-56 rounded-xl overflow-hidden z-10"
                    style={{
                      background: 'hsl(var(--secondary))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  >
                    <div
                      className="p-2"
                      style={{ borderBottom: '1px solid hsl(var(--border))' }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: 'hsl(var(--muted-foreground))' }}
                      >
                        UI Components
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                      {TEMPLATE_PROMPTS.map((template) => (
                        <button
                          key={template.label}
                          type="button"
                          onClick={() => handleTemplateSelect(template.prompt)}
                          className="w-full flex flex-col px-3 py-2 text-left rounded-lg transition-colors hover:opacity-80"
                          style={{
                            color: 'hsl(var(--foreground))',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'hsl(var(--muted))'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          <span className="text-sm font-medium">{template.label}</span>
                          <span
                            className="text-xs"
                            style={{ color: 'hsl(var(--muted-foreground))' }}
                          >
                            {template.prompt}
                          </span>
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
        <div
          className="w-[500px] flex flex-col rounded-xl overflow-hidden"
          style={{
            background: 'hsl(var(--secondary))',
            border: '1px solid hsl(var(--border))',
          }}
        >
          <PreviewHeader
            previewHistoryLength={previewHistory.length}
            currentPreviewIndex={currentPreviewIndex}
            currentPreviewLabel={currentPreview?.label ?? null}
            currentPreviewCode={currentPreview?.code ?? null}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />

          <div
            className="flex-1 overflow-auto p-4"
            style={{ background: 'hsl(var(--background))' }}
          >
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
