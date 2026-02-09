import type { AgentInput, AgentOutput } from '../types'

// Skill configuration
export interface SkillConfig {
  id: string
  name: string
  description: string
  triggers: string[] // Keywords that activate this skill
  priority: number // Higher = checked first
}

// Skill interface that all skills must implement
export interface Skill {
  config: SkillConfig
  matches(input: AgentInput): boolean
  execute(input: AgentInput): Promise<AgentOutput>
}

// Skill execution context with additional helpers
export interface SkillContext {
  input: AgentInput
  estimateTokens: (text: string) => number
}

// Result from skill matching
export interface SkillMatch {
  skill: Skill
  confidence: number // 0-1 confidence score
}
