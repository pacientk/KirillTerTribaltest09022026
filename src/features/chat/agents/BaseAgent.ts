import type { Agent, AgentConfig, AgentInput, AgentOutput } from './types'
import type { Skill } from './skills/types'
import { getSkillsById, findBestSkill } from './skills'
import { contextManager } from '../orchestrator/ContextManager'

/**
 * BaseAgent provides common functionality for all agents.
 * Subclasses should override canHandle() and execute() as needed.
 */
export abstract class BaseAgent implements Agent {
  abstract config: AgentConfig

  /**
   * Gets the skills available to this agent.
   */
  protected getAvailableSkills(): Skill[] {
    return getSkillsById(this.config.skills)
  }

  /**
   * Finds the best matching skill for the given input.
   */
  protected findMatchingSkill(input: AgentInput): Skill | null {
    return findBestSkill(input, this.config.skills)
  }

  /**
   * Estimates tokens for a given text.
   */
  protected estimateTokens(text: string): number {
    return contextManager.estimateTokens(text)
  }

  /**
   * Checks if this agent can handle the input.
   * Default implementation checks if any skill matches.
   */
  canHandle(input: AgentInput): boolean {
    return this.findMatchingSkill(input) !== null
  }

  /**
   * Executes the agent's task.
   * Default implementation uses the best matching skill.
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    const skill = this.findMatchingSkill(input)

    if (!skill) {
      return {
        content: 'Cannot process this request. Please try rephrasing.',
        metadata: {
          tokensUsed: 0,
          cached: false,
          duration: Date.now() - startTime,
        },
      }
    }

    const result = await skill.execute(input)

    return {
      ...result,
      metadata: {
        ...result.metadata,
        tokensUsed: result.metadata?.tokensUsed ?? this.estimateTokens(result.content),
        cached: result.metadata?.cached ?? false,
        duration: Date.now() - startTime,
        skillUsed: skill.config.id,
      },
    }
  }
}
