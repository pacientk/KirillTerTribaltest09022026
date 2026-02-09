import type { Message, Attachment } from '../models'
import type { OrchestratorProgress, OrchestratorResponse } from '../orchestrator/types'
import { Orchestrator } from '../orchestrator/Orchestrator'

/**
 * ChatService provides an abstraction over the orchestrator for chat functionality.
 */
export class ChatService {
  private orchestrator: Orchestrator

  constructor() {
    this.orchestrator = new Orchestrator()
  }

  /**
   * Sends a message and gets a response from the orchestrator.
   */
  async sendMessage(
    userRequest: string,
    history: Message[],
    attachments?: Attachment[],
    onProgress?: (progress: OrchestratorProgress) => void
  ): Promise<OrchestratorResponse> {
    return this.orchestrator.execute(
      {
        userRequest,
        history,
        attachments,
      },
      onProgress
    )
  }

  /**
   * Clears the orchestrator's cache.
   */
  clearCache(): void {
    this.orchestrator.clearCache()
  }

  /**
   * Gets cache statistics.
   */
  getCacheStats(): { size: number; maxSize: number; maxAgeMs: number } {
    return this.orchestrator.getCacheStats()
  }
}

// Default instance
export const chatService = new ChatService()
