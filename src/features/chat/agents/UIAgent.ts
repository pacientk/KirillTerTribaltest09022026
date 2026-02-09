import { BaseAgent } from './BaseAgent'
import type { AgentConfig, AgentInput, AgentOutput } from './types'
import { AGENT_CONFIGS } from './types'

/**
 * UIAgent specializes in generating UI components.
 * Uses skills for navbar, form, card, button, modal, table, sidebar, hero.
 */
export class UIAgent extends BaseAgent {
  config: AgentConfig = AGENT_CONFIGS.ui

  /**
   * UI-specific trigger keywords (Russian and English).
   */
  private readonly uiTriggers = [
    // Action words
    'create',
    'add',
    'make',
    'build',
    'generate',
    // Generic
    'component',
    'ui',
    'element',
    // Component names
    'navbar',
    'nav',
    'button',
    'btn',
    'form',
    'card',
    'modal',
    'table',
    'sidebar',
    'hero',
    'pricing',
    'footer',
    'testimonial',
    'features',
  ]

  /**
   * Checks if the request is UI-related.
   */
  canHandle(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()

    // First check if any skill matches
    if (super.canHandle(input)) {
      return true
    }

    // Then check for UI-specific triggers
    return this.uiTriggers.some((trigger) => content.includes(trigger))
  }

  /**
   * Executes UI generation with enhanced output.
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const result = await super.execute(input)

    // If no skill matched, provide a helpful fallback
    if (!result.code) {
      return {
        content:
          'I can create the following UI components: navbar, form, card, button, modal, table, sidebar, hero, pricing, footer, testimonials, features. Please specify which component you need.',
        metadata: result.metadata,
      }
    }

    return result
  }
}

export const uiAgent = new UIAgent()
