import { render, screen } from '@testing-library/react'
import { StatusIndicator } from './StatusIndicator'
import { Status } from '../../types'

describe('StatusIndicator', () => {
  it('renders nothing when status is idle', () => {
    const { container } = render(<StatusIndicator status="idle" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders typing status', () => {
    render(<StatusIndicator status="typing" />)
    expect(screen.getByText('Typing...')).toBeInTheDocument()
  })

  it('renders loading status', () => {
    render(<StatusIndicator status="loading" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders generating status', () => {
    render(<StatusIndicator status="generating" />)
    expect(screen.getByText('Generating UI...')).toBeInTheDocument()
  })

  it('renders error status', () => {
    render(<StatusIndicator status="error" />)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('renders success status', () => {
    render(<StatusIndicator status="success" />)
    expect(screen.getByText('Done!')).toBeInTheDocument()
  })

  it('has correct aria attributes', () => {
    render(<StatusIndicator status="typing" />)
    const indicator = screen.getByRole('status')
    expect(indicator).toHaveAttribute('aria-live', 'polite')
  })

  it('applies custom className', () => {
    render(<StatusIndicator status="typing" className="custom-class" />)
    const indicator = screen.getByRole('status')
    expect(indicator).toHaveClass('custom-class')
  })

  it.each<Status>(['typing', 'loading', 'generating'])('has animated dot for %s status', (status) => {
    render(<StatusIndicator status={status} />)
    const dot = document.querySelector('.status-dot')
    expect(dot).toHaveClass('animate-pulse')
  })

  it.each<Status>(['error', 'success'])('has non-animated dot for %s status', (status) => {
    render(<StatusIndicator status={status} />)
    const dot = document.querySelector('.status-dot')
    expect(dot).not.toHaveClass('animate-pulse')
  })
})
