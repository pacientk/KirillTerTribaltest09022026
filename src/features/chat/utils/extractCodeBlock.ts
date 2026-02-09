/**
 * Extracts code blocks from markdown content.
 */
export function extractCodeFromMarkdown(content: string): string | null {
  // Match ```tsx or ```jsx or ```javascript code blocks
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript)\n([\s\S]*?)```/
  const match = content.match(codeBlockRegex)
  return match ? match[1].trim() : null
}

/**
 * Extracts all code blocks from a message.
 */
export function extractAllCodeBlocks(content: string): string | null {
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript|html|css)?\n([\s\S]*?)```/g
  const matches = [...content.matchAll(codeBlockRegex)]
  if (matches.length > 0) {
    return matches.map((m) => m[1].trim()).join('\n\n')
  }
  return null
}

/**
 * Detects the component type based on code content.
 */
export type ComponentType =
  | 'navbar'
  | 'form'
  | 'card'
  | 'button'
  | 'modal'
  | 'table'
  | 'hero'
  | 'sidebar'
  | 'pricing'
  | 'footer'
  | 'testimonial'
  | 'features'
  | 'unknown'

export function detectComponentType(code: string): ComponentType {
  const lower = code.toLowerCase()
  if (lower.includes('navbar') || lower.includes('<nav')) return 'navbar'
  if (lower.includes('form') || lower.includes('<form')) return 'form'
  if (lower.includes('card')) return 'card'
  if (lower.includes('buttonshowcase') || (lower.includes('button') && lower.includes('variant'))) return 'button'
  if (lower.includes('modal') || lower.includes('backdrop')) return 'modal'
  if (lower.includes('table') || lower.includes('<th')) return 'table'
  if (lower.includes('hero')) return 'hero'
  if (lower.includes('sidebar') || lower.includes('side menu')) return 'sidebar'
  if (lower.includes('pricing') || lower.includes('plan')) return 'pricing'
  if (lower.includes('footer')) return 'footer'
  if (lower.includes('testimonial') || lower.includes('review')) return 'testimonial'
  if (lower.includes('features')) return 'features'
  return 'unknown'
}

/**
 * Detects a human-readable label for the component type.
 */
export function detectComponentLabel(code: string): string {
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
