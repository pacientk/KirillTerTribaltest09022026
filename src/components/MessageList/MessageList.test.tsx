import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MessageList } from './MessageList'
import type { Message } from '../../types'

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, can you help me?',
    createdAt: new Date('2024-01-01T10:00:00'),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! How can I assist you today?',
    createdAt: new Date('2024-01-01T10:01:00'),
  },
]

describe('MessageList', () => {
  it('renders empty state when no messages', () => {
    render(<MessageList messages={[]} />)
    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument()
  })

  it('renders messages', () => {
    render(<MessageList messages={mockMessages} />)
    expect(screen.getByText('Hello, can you help me?')).toBeInTheDocument()
    expect(screen.getByText('Of course! How can I assist you today?')).toBeInTheDocument()
  })

  it('renders user messages with correct styling', () => {
    render(<MessageList messages={mockMessages} />)
    const userMessage = screen.getByTestId('message-1')
    expect(userMessage).toHaveClass('justify-end')
  })

  it('renders assistant messages with correct styling', () => {
    render(<MessageList messages={mockMessages} />)
    const assistantMessage = screen.getByTestId('message-2')
    expect(assistantMessage).toHaveClass('justify-start')
  })

  it('has correct aria attributes', () => {
    render(<MessageList messages={mockMessages} />)
    const list = screen.getByRole('log')
    expect(list).toHaveAttribute('aria-live', 'polite')
  })

  it('renders message with attachments', () => {
    const messageWithAttachment: Message = {
      id: '3',
      role: 'user',
      content: 'Check this file',
      attachments: [
        { id: 'a1', name: 'test.tsx', type: 'code', mimeType: 'text/plain', url: '' },
      ],
      createdAt: new Date(),
    }
    render(<MessageList messages={[messageWithAttachment]} />)
    expect(screen.getByText('📄 test.tsx')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<MessageList messages={[]} className="custom-class" />)
    const list = screen.getByRole('log')
    expect(list).toHaveClass('custom-class')
  })
})
