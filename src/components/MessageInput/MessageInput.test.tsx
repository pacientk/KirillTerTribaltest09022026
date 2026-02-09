import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessageInput } from './MessageInput'

describe('MessageInput', () => {
  const mockOnSend = jest.fn<(msg: string, att?: unknown) => void>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders textarea and send button', () => {
    render(<MessageInput onSend={mockOnSend} />)
    expect(screen.getByLabelText('Message input')).toBeInTheDocument()
    expect(screen.getByLabelText('Send message')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<MessageInput onSend={mockOnSend} placeholder="Custom placeholder" />)
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('calls onSend when clicking send button', async () => {
    const user = userEvent.setup()
    render(<MessageInput onSend={mockOnSend} />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'Hello')
    await user.click(screen.getByLabelText('Send message'))

    expect(mockOnSend).toHaveBeenCalledWith('Hello', undefined)
  })

  it('calls onSend when pressing Enter', async () => {
    const user = userEvent.setup()
    render(<MessageInput onSend={mockOnSend} />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'Hello{enter}')

    expect(mockOnSend).toHaveBeenCalledWith('Hello', undefined)
  })

  it('does not send on Shift+Enter', async () => {
    const user = userEvent.setup()
    render(<MessageInput onSend={mockOnSend} />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'Hello{shift>}{enter}{/shift}')

    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    render(<MessageInput onSend={mockOnSend} />)

    const textarea = screen.getByLabelText('Message input') as HTMLTextAreaElement
    await user.type(textarea, 'Hello{enter}')

    expect(textarea.value).toBe('')
  })

  it('disables send button when empty', () => {
    render(<MessageInput onSend={mockOnSend} />)
    expect(screen.getByLabelText('Send message')).toBeDisabled()
  })

  it('disables input when disabled prop is true', () => {
    render(<MessageInput onSend={mockOnSend} disabled />)
    expect(screen.getByLabelText('Message input')).toBeDisabled()
    expect(screen.getByLabelText('Send message')).toBeDisabled()
  })

  it('calls onTyping when typing', async () => {
    const mockOnTyping = jest.fn<() => void>()
    const user = userEvent.setup()
    render(<MessageInput onSend={mockOnSend} onTyping={mockOnTyping} />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, 'H')

    expect(mockOnTyping).toHaveBeenCalled()
  })

  it('does not send whitespace-only messages', async () => {
    const user = userEvent.setup()
    render(<MessageInput onSend={mockOnSend} />)

    const textarea = screen.getByLabelText('Message input')
    await user.type(textarea, '   ')
    fireEvent.click(screen.getByLabelText('Send message'))

    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(<MessageInput onSend={mockOnSend} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
