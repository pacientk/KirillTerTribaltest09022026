import { useState, useCallback, useRef } from 'react'
import type { Message, Attachment } from '../types'
import type {
  OrchestratorProgress,
  OrchestratorResponse,
  OrchestratorRequest,
} from '../orchestrator/types'
import { Orchestrator } from '../orchestrator/Orchestrator'

interface UseOrchestratorOptions {
  onProgress?: (progress: OrchestratorProgress) => void
}

interface UseOrchestratorReturn {
  execute: (
    userRequest: string,
    history: Message[],
    attachments?: Attachment[]
  ) => Promise<OrchestratorResponse>
  progress: OrchestratorProgress | null
  isExecuting: boolean
  clearCache: () => void
  getCacheStats: () => { size: number; maxSize: number; maxAgeMs: number }
}

/**
 * React hook for using the Orchestrator in components.
 */
export function useOrchestrator(
  options: UseOrchestratorOptions = {}
): UseOrchestratorReturn {
  const [progress, setProgress] = useState<OrchestratorProgress | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const orchestratorRef = useRef<Orchestrator | null>(null)

  // Lazy initialize orchestrator
  const getOrchestrator = useCallback(() => {
    if (!orchestratorRef.current) {
      orchestratorRef.current = new Orchestrator()
    }
    return orchestratorRef.current
  }, [])

  const execute = useCallback(
    async (
      userRequest: string,
      history: Message[],
      attachments?: Attachment[]
    ): Promise<OrchestratorResponse> => {
      setIsExecuting(true)

      const request: OrchestratorRequest = {
        userRequest,
        history,
        attachments,
      }

      const handleProgress = (p: OrchestratorProgress) => {
        setProgress(p)
        options.onProgress?.(p)
      }

      try {
        const response = await getOrchestrator().execute(request, handleProgress)
        return response
      } finally {
        setIsExecuting(false)
      }
    },
    [getOrchestrator, options]
  )

  const clearCache = useCallback(() => {
    getOrchestrator().clearCache()
  }, [getOrchestrator])

  const getCacheStats = useCallback(() => {
    return getOrchestrator().getCacheStats()
  }, [getOrchestrator])

  return {
    execute,
    progress,
    isExecuting,
    clearCache,
    getCacheStats,
  }
}
