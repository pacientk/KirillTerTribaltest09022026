import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock values
let mockScreenshot: { file: File; preview: string; type: 'image' } | null = null
let mockIsCapturing = false
let mockError: string | null = null
const mockCapture = jest.fn<() => Promise<void>>()
const mockClear = jest.fn<() => void>()

// Mock the hook before importing the component
jest.unstable_mockModule('../../hooks/useScreenshot', () => ({
  useScreenshot: () => ({
    screenshot: mockScreenshot,
    isCapturing: mockIsCapturing,
    error: mockError,
    capture: mockCapture,
    clear: mockClear,
  }),
}))

// Import component after mock is set up
const { ScreenshotCapture } = await import('./ScreenshotCapture')

describe('ScreenshotCapture', () => {
  const mockOnCapture = jest.fn<(s: unknown) => void>()

  beforeEach(() => {
    jest.clearAllMocks()
    mockScreenshot = null
    mockIsCapturing = false
    mockError = null
  })

  it('renders capture button', () => {
    render(<ScreenshotCapture onCapture={mockOnCapture} />)
    expect(screen.getByLabelText('Capture screenshot')).toBeInTheDocument()
    expect(screen.getByText('Capture Screen')).toBeInTheDocument()
  })

  it('calls capture when button is clicked', () => {
    render(<ScreenshotCapture onCapture={mockOnCapture} />)
    fireEvent.click(screen.getByLabelText('Capture screenshot'))
    expect(mockCapture).toHaveBeenCalled()
  })

  it('shows loading state when capturing', () => {
    mockIsCapturing = true
    render(<ScreenshotCapture onCapture={mockOnCapture} />)
    expect(screen.getByText('Capturing...')).toBeInTheDocument()
    expect(screen.getByLabelText('Capture screenshot')).toBeDisabled()
  })

  it('shows error message when error occurs', () => {
    mockError = 'Screen capture failed'
    render(<ScreenshotCapture onCapture={mockOnCapture} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Screen capture failed')
  })

  it('is disabled when disabled prop is true', () => {
    render(<ScreenshotCapture onCapture={mockOnCapture} disabled />)
    expect(screen.getByLabelText('Capture screenshot')).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ScreenshotCapture onCapture={mockOnCapture} className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
