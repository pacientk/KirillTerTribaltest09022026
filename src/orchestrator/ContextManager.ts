import type { Message } from '../types'
import type { AgentType } from '../agents/types'

/**
 * ContextManager handles context minimization to optimize token usage.
 * It extracts only relevant messages and compresses long content.
 */
export class ContextManager {
  private static readonly WORDS_TO_TOKENS_RATIO = 1.3

  /**
   * Extracts only relevant messages for a specific agent type.
   * This minimizes the context sent to agents, reducing token usage.
   */
  extractRelevantHistory(
    fullHistory: Message[],
    agentType: AgentType,
    maxTokens: number
  ): Message[] {
    if (fullHistory.length === 0) return []

    // Filter messages based on agent type relevance
    const relevantMessages = fullHistory.filter((msg) =>
      this.isRelevantForAgent(msg, agentType)
    )

    // Take messages from the end (most recent) until we hit token limit
    const result: Message[] = []
    let totalTokens = 0

    for (let i = relevantMessages.length - 1; i >= 0; i--) {
      const msg = relevantMessages[i]
      const msgTokens = this.estimateTokens(msg.content)

      if (totalTokens + msgTokens > maxTokens) {
        // Try to add a compressed version
        const compressed = this.compressMessage(msg, maxTokens - totalTokens)
        if (compressed) {
          result.unshift(compressed)
        }
        break
      }

      result.unshift(msg)
      totalTokens += msgTokens
    }

    return result
  }

  /**
   * Checks if a message is relevant for a specific agent type.
   */
  private isRelevantForAgent(message: Message, agentType: AgentType): boolean {
    const content = message.content.toLowerCase()

    switch (agentType) {
      case 'ui':
        // UI agent cares about component-related messages
        return (
          content.includes('component') ||
          content.includes('create') ||
          content.includes('add') ||
          content.includes('make') ||
          content.includes('build') ||
          content.includes('navbar') ||
          content.includes('button') ||
          content.includes('form') ||
          content.includes('card') ||
          content.includes('modal') ||
          content.includes('table') ||
          content.includes('sidebar') ||
          content.includes('hero') ||
          content.includes('ui') ||
          message.role === 'user' // Always include user messages for context
        )

      case 'analysis':
        // Analysis agent cares about code and analysis requests
        return (
          content.includes('analysis') ||
          content.includes('analyze') ||
          content.includes('explain') ||
          content.includes('code') ||
          content.includes('review') ||
          message.attachments?.some((a) => a.type === 'code' || a.type === 'image') ||
          message.role === 'user'
        )

      case 'general':
        // General agent handles everything
        return true

      default:
        return true
    }
  }

  /**
   * Compresses a message to fit within a token limit.
   * Returns null if the message can't be meaningfully compressed.
   */
  compressMessage(message: Message, maxTokens: number): Message | null {
    const minUsefulTokens = 20
    if (maxTokens < minUsefulTokens) return null

    const maxChars = Math.floor(maxTokens / this.constructor.prototype.constructor.WORDS_TO_TOKENS_RATIO) * 5

    if (message.content.length <= maxChars) {
      return message
    }

    // Truncate content and add ellipsis
    const truncated = message.content.slice(0, maxChars - 3) + '...'

    return {
      ...message,
      content: truncated,
    }
  }

  /**
   * Estimates token count for a given text.
   * Uses approximate ratio: tokens ≈ words × 1.3
   */
  estimateTokens(text: string): number {
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.ceil(words * ContextManager.WORDS_TO_TOKENS_RATIO)
  }

  /**
   * Estimates total tokens for a list of messages.
   */
  estimateTotalTokens(messages: Message[]): number {
    return messages.reduce((total, msg) => total + this.estimateTokens(msg.content), 0)
  }
}

// Singleton instance
export const contextManager = new ContextManager()
