import { useState, useCallback } from 'react'
import {
  MessageList,
  MessageInput,
  FileUpload,
  ScreenshotCapture,
  UIPreview,
} from './components'
import { Message, FileUploadResult, Attachment } from './types'
import { useOrchestrator } from './hooks'
import type { OrchestratorProgress } from './orchestrator'
import './App.css'

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

const statusIcons: Record<string, string> = {
  planning: '🔍',
  executing: '⚡',
  aggregating: '📦',
  completed: '✅',
  failed: '❌',
}

interface PreviewHistoryItem {
  messageId: string
  code: string
  label: string
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

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [attachments, setAttachments] = useState<FileUploadResult[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [previewHistory, setPreviewHistory] = useState<PreviewHistoryItem[]>([])
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(-1)
  const [orchestratorProgress, setOrchestratorProgress] = useState<OrchestratorProgress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)

  const orchestrator = useOrchestrator({
    onProgress: setOrchestratorProgress,
  })

  const currentPreview = currentPreviewIndex >= 0 ? previewHistory[currentPreviewIndex] : null

  const handleSelectPreview = useCallback((messageId: string) => {
    const index = previewHistory.findIndex(p => p.messageId === messageId)
    if (index >= 0) {
      setCurrentPreviewIndex(index)
    }
  }, [previewHistory])

  const handleUndo = useCallback(() => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1)
    }
  }, [currentPreviewIndex])

  const handleRedo = useCallback(() => {
    if (currentPreviewIndex < previewHistory.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1)
    }
  }, [currentPreviewIndex, previewHistory.length])

  const handleTemplateSelect = useCallback((prompt: string) => {
    setInputValue(prompt)
    setShowTemplates(false)
  }, [])

  const handleSend = useCallback(
    async (content: string, messageAttachments?: FileUploadResult[]) => {
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        attachments: messageAttachments?.map(fileToAttachment),
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsProcessing(true)
      setAttachments([])
      setShowUpload(false)
      setInputValue('')

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

        setMessages((prev) => [...prev, assistantMessage])

        // Add to preview history
        const code = response.code || extractCodeFromMessage(assistantContent)
        if (code) {
          const newPreviewItem: PreviewHistoryItem = {
            messageId: assistantMessage.id,
            code,
            label: detectComponentLabel(code),
          }
          setPreviewHistory((prev) => [...prev, newPreviewItem])
          setCurrentPreviewIndex((prev) => prev + 1)
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
        setIsProcessing(false)
      }
    },
    [messages, orchestrator]
  )

  const handleFileUpload = useCallback((files: FileUploadResult[]) => {
    setAttachments((prev) => [...prev, ...files])
  }, [])

  const handleScreenshot = useCallback((screenshot: FileUploadResult) => {
    setAttachments((prev) => [...prev, screenshot])
  }, [])

  const handleAttachmentsChange = useCallback((newAttachments: FileUploadResult[]) => {
    setAttachments(newAttachments)
  }, [])

  return (
    <div className="app min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="chat-header flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h1 className="text-xl font-bold text-white">
              AI UI Builder
            </h1>
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

          <MessageList
            messages={messages}
            className="flex-1"
            onSelectPreview={handleSelectPreview}
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
                onClick={() => setShowUpload(!showUpload)}
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
                  onClick={() => setShowTemplates(!showTemplates)}
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
              onSend={handleSend}
              disabled={isProcessing}
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              placeholder="Describe the UI component you want..."
              value={inputValue}
              onChange={setInputValue}
            />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-[500px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                UI Preview
              </h2>
              {previewHistory.length > 0 && (
                <div className="flex items-center gap-2">
                  {/* Undo button */}
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={currentPreviewIndex <= 0}
                    className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous (Undo)"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                  </button>

                  {/* History indicator */}
                  <span className="text-white/90 text-sm font-medium min-w-[60px] text-center">
                    {currentPreviewIndex + 1} / {previewHistory.length}
                  </span>

                  {/* Redo button */}
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={currentPreviewIndex >= previewHistory.length - 1}
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
            {currentPreview && (
              <div className="mt-1 text-white/70 text-sm">
                {currentPreview.label}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {currentPreview ? (
              <UIPreview code={currentPreview.code} />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
