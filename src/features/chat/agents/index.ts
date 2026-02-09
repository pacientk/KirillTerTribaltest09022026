// Types
export * from './types'

// Base agent
export { BaseAgent } from './BaseAgent'

// Agents
export { UIAgent, uiAgent } from './UIAgent'
export { AnalysisAgent, analysisAgent } from './AnalysisAgent'
export { GeneralAgent, generalAgent } from './GeneralAgent'

// Skills
export * from './skills'

// Agent registry
import type { Agent, AgentType } from './types'
import { uiAgent } from './UIAgent'
import { analysisAgent } from './AnalysisAgent'
import { generalAgent } from './GeneralAgent'

const agentRegistry = new Map<AgentType, Agent>([
  ['ui', uiAgent as Agent],
  ['analysis', analysisAgent as Agent],
  ['general', generalAgent as Agent],
])

/**
 * Gets an agent by its type.
 */
export function getAgent(type: AgentType): Agent {
  const agent = agentRegistry.get(type)
  if (!agent) {
    throw new Error(`Unknown agent type: ${type}`)
  }
  return agent
}

/**
 * Gets all available agents.
 */
export function getAllAgents(): Agent[] {
  return Array.from(agentRegistry.values())
}

/**
 * Gets agents sorted by priority (highest first).
 */
export function getAgentsByPriority(): Agent[] {
  return getAllAgents().sort((a, b) => b.config.priority - a.config.priority)
}
