import { BaseAgent } from './BaseAgent'
import type { AgentConfig, AgentInput, AgentOutput } from './types'
import { AGENT_CONFIGS } from './types'

/**
 * GeneralAgent handles general tasks and serves as a fallback.
 */
export class GeneralAgent extends BaseAgent {
  config: AgentConfig = AGENT_CONFIGS.general

  /**
   * GeneralAgent can handle anything as a fallback.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canHandle(_input: AgentInput): boolean {
    return true
  }

  /**
   * Executes general task handling.
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const content = input.userRequest.toLowerCase()

    let response: string
    let code: string | undefined

    if (this.isSearchRequest(content)) {
      response = this.handleSearch(input.userRequest)
    } else if (this.isExplainRequest(content)) {
      response = this.handleExplain(input.userRequest)
    } else if (this.isRefactorRequest(content)) {
      const result = this.handleRefactor(input.userRequest)
      response = result.content
      code = result.code
    } else {
      response = this.handleGeneral(input.userRequest)
    }

    return {
      content: response,
      code,
      metadata: {
        tokensUsed: this.estimateTokens(response),
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: 'general',
      },
    }
  }

  private isSearchRequest(content: string): boolean {
    const triggers = ['search', 'find', 'where', 'locate']
    return triggers.some((t) => content.includes(t))
  }

  private isExplainRequest(content: string): boolean {
    const triggers = ['explain', 'what is', 'how does', 'tell me about']
    return triggers.some((t) => content.includes(t))
  }

  private isRefactorRequest(content: string): boolean {
    const triggers = ['refactor', 'improve', 'optimize', 'clean up']
    return triggers.some((t) => content.includes(t))
  }

  private handleSearch(request: string): string {
    return `## Search Results

For query "${request}" found:

### Files
- \`src/components/\` - components directory
- \`src/hooks/\` - custom hooks
- \`src/types/\` - TypeScript types

### Recommendations
Refine your search by specifying:
- File or component name
- Content type (component, hook, type)
- Keywords in code`
  }

  private handleExplain(request: string): string {
    return `## Explanation

${request}

### Key Concepts

**React Components** - reusable UI blocks that accept props and return JSX.

**Hooks** - functions for working with state and lifecycle in functional components:
- \`useState\` - local state
- \`useEffect\` - side effects
- \`useMemo\` - value memoization
- \`useCallback\` - callback memoization

**TypeScript** - typed superset of JavaScript for safer code.

Would you like to learn more about something specific?`
  }

  private handleRefactor(request: string): { content: string; code: string } {
    return {
      content: `## Refactoring Suggestions

Based on request "${request}":

### Improvements Made
1. Extracted constants
2. Added typing
3. Applied memoization
4. Improved readability

### Before and After
See the generated code on the right.`,
      code: `// Refactored: improved version

import { useMemo, useCallback, type FC } from 'react'

// Constants
const CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 5000,
} as const

// Types
interface Props {
  data: DataItem[]
  onSelect: (item: DataItem) => void
}

interface DataItem {
  id: string
  name: string
  value: number
}

// Component
export const RefactoredComponent: FC<Props> = ({ data, onSelect }) => {
  // Memoized computations
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  )

  // Memoized callback
  const handleSelect = useCallback(
    (item: DataItem) => {
      onSelect(item)
    },
    [onSelect]
  )

  return (
    <ul className="space-y-2">
      {sortedData.map((item) => (
        <li
          key={item.id}
          onClick={() => handleSelect(item)}
          className="p-3 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
        >
          <span className="font-medium">{item.name}</span>
          <span className="text-gray-500 ml-2">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}`,
    }
  }

  private handleGeneral(request: string): string {
    return `Request received: "${request}"

I can help with:

**UI Components** - say "create navbar/form/card/button/modal/table"

**Analysis** - upload code or image for analysis

**Explanation** - ask "explain" or "how does it work"

**Search** - say "find" with keywords

How can I help?`
  }
}

export const generalAgent = new GeneralAgent()
