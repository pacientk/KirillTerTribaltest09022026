import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  const mockOnUpload = jest.fn<(files: unknown[]) => void>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload zone', () => {
    render(<FileUpload onUpload={mockOnUpload} />)
    expect(screen.getByLabelText('Upload files')).toBeInTheDocument()
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument()
  })

  it('shows file type hints', () => {
    render(<FileUpload onUpload={mockOnUpload} />)
    expect(screen.getByText(/Images.*PNG, JPG, SVG.*or code files/)).toBeInTheDocument()
  })

  it('handles drag over state', () => {
    render(<FileUpload onUpload={mockOnUpload} />)
    const dropZone = screen.getByLabelText('Upload files')

    fireEvent.dragOver(dropZone)
    expect(dropZone).toHaveClass('border-blue-500')

    fireEvent.dragLeave(dropZone)
    expect(dropZone).not.toHaveClass('border-blue-500')
  })

  it('processes valid image files', async () => {
    render(<FileUpload onUpload={mockOnUpload} />)

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled()
      const uploadedFiles = mockOnUpload.mock.calls[0][0]
      expect(uploadedFiles[0].type).toBe('image')
    })
  })

  it('processes valid code files', async () => {
    render(<FileUpload onUpload={mockOnUpload} />)

    const file = new File(['const x = 1'], 'test.tsx', { type: 'text/plain' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled()
      const uploadedFiles = mockOnUpload.mock.calls[0][0]
      expect(uploadedFiles[0].type).toBe('code')
    })
  })

  it('shows error for invalid file types', async () => {
    render(<FileUpload onUpload={mockOnUpload} />)

    const file = new File(['test'], 'test.exe', { type: 'application/exe' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unsupported files: test.exe')
    })
  })

  it('is disabled when disabled prop is true', () => {
    render(<FileUpload onUpload={mockOnUpload} disabled />)
    const dropZone = screen.getByLabelText('Upload files')
    expect(dropZone).toHaveClass('opacity-50')
    expect(dropZone).toHaveAttribute('tabindex', '-1')
  })

  it('opens file dialog on click', () => {
    render(<FileUpload onUpload={mockOnUpload} />)
    const dropZone = screen.getByLabelText('Upload files')
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    const clickSpy = jest.spyOn(input, 'click')
    fireEvent.click(dropZone)

    expect(clickSpy).toHaveBeenCalled()
  })

  it('opens file dialog on Enter key', () => {
    render(<FileUpload onUpload={mockOnUpload} />)
    const dropZone = screen.getByLabelText('Upload files')
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    const clickSpy = jest.spyOn(input, 'click')
    fireEvent.keyDown(dropZone, { key: 'Enter' })

    expect(clickSpy).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(<FileUpload onUpload={mockOnUpload} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
