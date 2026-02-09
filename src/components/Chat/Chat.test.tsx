import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the api module before importing Chat
const mockSendMessage = jest.fn<(content: string, attachments?: unknown[]) => Promise<string>>()

jest.unstable_mockModule('../../services/api', () => ({
  sendMessage: mockSendMessage,
}))

// Import Chat after mock is set up
const { Chat } = await import('./Chat')

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSendMessage.mockResolvedValue('AI response')
  })

  it('renders chat interface', () => {
    render(<Chat />)
    expect(screen.getByText('AI UI Builder Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('Message input')).toBeInTheDocument()
    expect(screen.getByLabelText('Send message')).toBeInTheDocument()
  })

  it('shows empty state initially', () => {
    render(<Chat />)
    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument()
  })

  it('sends message and displays response', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'Hello AI')
    await user.click(screen.getByLabelText('Send message'))

    expect(screen.getByText('Hello AI')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('AI response')).toBeInTheDocument()
    })
  })

  it('toggles file upload section', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    const toggleButton = screen.getByLabelText('Show file upload')
    await user.click(toggleButton)

    expect(screen.getByLabelText('Upload files')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Hide file upload'))
    expect(screen.queryByLabelText('Upload files')).not.toBeInTheDocument()
  })

  it('disables input while loading', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('Response'), 100))
    )

    render(<Chat />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'Hello')
    await user.click(screen.getByLabelText('Send message'))

    expect(screen.getByLabelText('Message input')).toBeDisabled()
  })

  it('handles API error', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSendMessage.mockRejectedValue(new Error('API error'))

    render(<Chat />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'Hello')
    await user.click(screen.getByLabelText('Send message'))

    await waitFor(() => {
      expect(screen.getByText('Error occurred')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('applies custom className', () => {
    const { container } = render(<Chat className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
