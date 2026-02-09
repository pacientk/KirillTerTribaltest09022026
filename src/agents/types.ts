import type { Message, Attachment } from '../types'

// Agent configuration
export interface AgentConfig {
  id: string
  name: string
  description: string
  skills: string[] // Skill IDs this agent can use
  priority: number // 1-10, higher = more important
  maxContextTokens: number // Token limit for context optimization
}

// Input provided to an agent for processing
export interface AgentInput {
  userRequest: string
  relevantHistory: Message[] // Only relevant messages, not full history
  attachments?: Attachment[]
  context?: Record<string, unknown>
}

// Output returned by an agent
export interface AgentOutput {
  content: string
  code?: string
  metadata?: AgentOutputMetadata
}

export interface AgentOutputMetadata {
  tokensUsed: number
  cached: boolean
  duration: number
  skillUsed?: string
}

// Agent interface that all agents must implement
export interface Agent {
  config: AgentConfig
  canHandle(input: AgentInput): boolean
  execute(input: AgentInput): Promise<AgentOutput>
}

// Agent types enum for type safety
export type AgentType = 'ui' | 'analysis' | 'general'

// Predefined agent configurations
export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  ui: {
    id: 'ui-agent',
    name: 'UI Agent',
    description: 'Generates UI components based on user requests',
    skills: ['navbar', 'form', 'card', 'button', 'modal', 'table', 'sidebar', 'hero', 'pricing', 'footer', 'testimonial', 'features'],
    priority: 8,
    maxContextTokens: 2000,
  },
  analysis: {
    id: 'analysis-agent',
    name: 'Analysis Agent',
    description: 'Analyzes code and images',
    skills: ['code-analysis', 'image-analysis'],
    priority: 6,
    maxContextTokens: 3000,
  },
  general: {
    id: 'general-agent',
    name: 'General Agent',
    description: 'Handles general tasks and fallback requests',
    skills: ['search', 'refactor', 'explain'],
    priority: 4,
    maxContextTokens: 2500,
  },
}
