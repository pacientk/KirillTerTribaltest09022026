import type { Message, Attachment } from '../types'
import type { AgentInput, AgentOutput } from '../agents/types'

// Task status enum
export type TaskStatus = 'pending' | 'queued' | 'running' | 'completed' | 'failed'

// Task definition
export interface Task {
  id: string
  agentId: string
  input: AgentInput
  status: TaskStatus
  priority: number
  dependencies: string[] // IDs of tasks this depends on
  output?: AgentOutput
  error?: string
  createdAt: number
  startedAt?: number
  completedAt?: number
}

// Execution plan created by orchestrator
export interface ExecutionPlan {
  tasks: Task[]
  parallelGroups: Task[][] // Groups of tasks that can run in parallel
  estimatedTokens: number
}

// Progress update from orchestrator
export interface OrchestratorProgress {
  totalTasks: number
  completedTasks: number
  runningTasks: Task[]
  status: OrchestratorStatus
}

export type OrchestratorStatus = 'planning' | 'executing' | 'aggregating' | 'completed' | 'failed'

// Request to orchestrator
export interface OrchestratorRequest {
  userRequest: string
  history: Message[]
  attachments?: Attachment[]
}

// Response from orchestrator
export interface OrchestratorResponse {
  content: string
  code?: string
  tasks: Task[]
  metadata: OrchestratorMetadata
}

export interface OrchestratorMetadata {
  totalTokensUsed: number
  cachedResults: number
  totalDuration: number
  tasksExecuted: number
}

// Progress callback type
export type ProgressCallback = (progress: OrchestratorProgress) => void

// Cache entry
export interface CacheEntry {
  key: string
  output: AgentOutput
  timestamp: number
  hits: number
}
