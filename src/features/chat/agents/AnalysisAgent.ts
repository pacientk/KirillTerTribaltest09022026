import { BaseAgent } from './BaseAgent'
import type { AgentConfig, AgentInput, AgentOutput } from './types'
import { AGENT_CONFIGS } from './types'

/**
 * AnalysisAgent specializes in analyzing code and images.
 */
export class AnalysisAgent extends BaseAgent {
  config: AgentConfig = AGENT_CONFIGS.analysis

  /**
   * Analysis-specific trigger keywords.
   */
  private readonly analysisTriggers = [
    'analyze',
    'analysis',
    'explain',
    'review',
    'check',
    'look at',
    'inspect',
    'examine',
  ]

  /**
   * Checks if the request is analysis-related.
   */
  canHandle(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()

    // Check for attachments that need analysis
    if (input.attachments && input.attachments.length > 0) {
      const hasAnalyzableAttachments = input.attachments.some(
        (a) => a.type === 'code' || a.type === 'image'
      )
      if (hasAnalyzableAttachments) {
        return true
      }
    }

    // Check for analysis triggers
    return this.analysisTriggers.some((trigger) => content.includes(trigger))
  }

  /**
   * Executes analysis with mock results.
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const hasCodeAttachment = input.attachments?.some((a) => a.type === 'code')
    const hasImageAttachment = input.attachments?.some((a) => a.type === 'image')

    let content: string
    let code: string | undefined

    if (hasCodeAttachment) {
      const codeFile = input.attachments?.find((a) => a.type === 'code')
      content = this.analyzeCode(codeFile?.name || 'code', codeFile?.content || '')
      code = this.generateCodeSuggestion()
    } else if (hasImageAttachment) {
      const imageFile = input.attachments?.find((a) => a.type === 'image')
      content = this.analyzeImage(imageFile?.name || 'image')
    } else {
      content = this.analyzeRequest(input.userRequest)
    }

    return {
      content,
      code,
      metadata: {
        tokensUsed: this.estimateTokens(content),
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: hasCodeAttachment ? 'code-analysis' : hasImageAttachment ? 'image-analysis' : 'general-analysis',
      },
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private analyzeCode(filename: string, _content: string): string {
    return `## Code Analysis: ${filename}

### Structure
- File contains a React component
- Uses useState and useEffect hooks
- Styled with Tailwind CSS

### Code Quality
- **Readability**: Good structure and naming
- **Typing**: TypeScript types defined correctly
- **Performance**: No obvious issues

### Recommendations
1. Add memoization for expensive computations
2. Extract constants to a separate file
3. Add error handling`
  }

  private analyzeImage(filename: string): string {
    return `## Image Analysis: ${filename}

### Detected UI Elements
- Navigation bar at the top
- Main content in the center
- Sidebar on the left

### Color Scheme
- Primary: blue (#3B82F6)
- Background: light gray (#F3F4F6)
- Text: dark gray (#1F2937)

### Implementation Recommendations
I can create components based on this design. Please specify which element to implement first.`
  }

  private analyzeRequest(request: string): string {
    return `## Request Analysis

Your request: "${request}"

For more detailed analysis, please:
1. Attach a code file (.tsx, .ts, .css)
2. Or upload a screenshot/design image

I can analyze:
- Code structure and quality
- UI/UX design from images
- Architectural decisions`
  }

  private generateCodeSuggestion(): string {
    return `// Suggested improvements:

import { useMemo, useCallback } from 'react'

// 1. Memoize computations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data)
}, [data])

// 2. Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])

// 3. Extract constants
const CONSTANTS = {
  MAX_ITEMS: 10,
  DEFAULT_PAGE: 1,
} as const`
  }
}

export const analysisAgent = new AnalysisAgent()
