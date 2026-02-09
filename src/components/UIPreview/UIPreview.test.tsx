import { jest, describe, it, expect } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import { UIPreview } from './UIPreview'

describe('UIPreview', () => {
  const sampleCode = `
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Click me
    </button>
  )
}
`

  const markdownCode = `
Here's a button component:

\`\`\`tsx
function Button() {
  return <button>Click</button>
}
\`\`\`
`

  it('renders nothing when code is empty', () => {
    const { container } = render(<UIPreview code="" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders preview and code tabs', () => {
    render(<UIPreview code={sampleCode} />)
    expect(screen.getByRole('tab', { name: /Preview/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Code/i })).toBeInTheDocument()
  })

  it('shows preview tab by default', () => {
    render(<UIPreview code={sampleCode} />)
    const previewTab = screen.getByRole('tab', { name: /Preview/i })
    expect(previewTab).toHaveAttribute('aria-selected', 'true')
  })

  it('switches to code tab when clicked', () => {
    render(<UIPreview code={sampleCode} />)

    const codeTab = screen.getByRole('tab', { name: /Code/i })
    fireEvent.click(codeTab)

    expect(codeTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/function Button/)).toBeInTheDocument()
  })

  it('extracts code from markdown code blocks', () => {
    render(<UIPreview code={markdownCode} />)

    fireEvent.click(screen.getByRole('tab', { name: /Code/i }))

    // Should show extracted code, not the full markdown
    expect(screen.getByText(/function Button/)).toBeInTheDocument()
    expect(screen.queryByText("Here's a button component:")).not.toBeInTheDocument()
  })

  it('shows copy button in code view', () => {
    render(<UIPreview code={sampleCode} />)

    fireEvent.click(screen.getByRole('tab', { name: /Code/i }))

    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('copies code to clipboard when copy button is clicked', () => {
    const mockWriteText = jest.fn<(text: string) => Promise<void>>()
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })

    render(<UIPreview code={sampleCode} />)

    fireEvent.click(screen.getByRole('tab', { name: /Code/i }))
    fireEvent.click(screen.getByText('Copy'))

    expect(mockWriteText).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(<UIPreview code={sampleCode} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
