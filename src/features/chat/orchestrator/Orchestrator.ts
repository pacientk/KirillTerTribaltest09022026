import type {
  Task,
  ExecutionPlan,
  OrchestratorProgress,
  OrchestratorRequest,
  OrchestratorResponse,
  ProgressCallback,
} from './types'
import type { Agent, AgentInput, AgentOutput, AgentType } from '../agents/types'
import { getAgentsByPriority } from '../agents'
import { ContextManager } from './ContextManager'
import { TaskCache } from './TaskCache'

/**
 * Orchestrator coordinates multiple agents to handle user requests.
 * It plans tasks, manages dependencies, and executes tasks in parallel where possible.
 */
export class Orchestrator {
  private contextManager: ContextManager
  private taskCache: TaskCache
  private agents: Agent[]
  private taskIdCounter: number = 0

  constructor() {
    this.contextManager = new ContextManager()
    this.taskCache = new TaskCache()
    this.agents = getAgentsByPriority()
  }

  // Artificial delay for demo purposes (ms)
  private readonly STAGE_DELAY = 2000

  /**
   * Helper to add artificial delay between stages.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Main entry point for processing a user request.
   */
  async execute(
    request: OrchestratorRequest,
    onProgress?: ProgressCallback
  ): Promise<OrchestratorResponse> {
    const startTime = Date.now()

    // Report planning status
    this.reportProgress(onProgress, {
      totalTasks: 0,
      completedTasks: 0,
      runningTasks: [],
      status: 'planning',
    })

    // Artificial delay for planning stage
    await this.delay(this.STAGE_DELAY)

    // Create execution plan
    const plan = this.createPlan(request)

    // Report executing status
    this.reportProgress(onProgress, {
      totalTasks: plan.tasks.length,
      completedTasks: 0,
      runningTasks: [],
      status: 'executing',
    })

    // Execute tasks (already has internal delays)
    const completedTasks = await this.executePlan(plan, onProgress)

    // Artificial delay before aggregating
    await this.delay(this.STAGE_DELAY)

    // Report aggregating status
    this.reportProgress(onProgress, {
      totalTasks: plan.tasks.length,
      completedTasks: completedTasks.length,
      runningTasks: [],
      status: 'aggregating',
    })

    // Artificial delay for aggregating stage
    await this.delay(this.STAGE_DELAY)

    // Aggregate results
    const response = this.aggregateResults(completedTasks, startTime)

    // Report completed status
    this.reportProgress(onProgress, {
      totalTasks: plan.tasks.length,
      completedTasks: completedTasks.length,
      runningTasks: [],
      status: 'completed',
    })

    return response
  }

  /**
   * Creates an execution plan by analyzing the request and assigning agents.
   */
  private createPlan(request: OrchestratorRequest): ExecutionPlan {
    const tasks: Task[] = []
    const agentInput = this.createAgentInput(request)

    // Find agents that can handle this request
    const capableAgents = this.agents.filter((agent) => agent.canHandle(agentInput))

    if (capableAgents.length === 0) {
      // Fallback to general agent
      const generalAgent = this.agents.find((a) => a.config.id === 'general-agent')
      if (generalAgent) {
        capableAgents.push(generalAgent)
      }
    }

    // Check if analysis agent should run in parallel (when attachments present)
    const hasAttachments = request.attachments && request.attachments.length > 0
    const analysisAgent = this.agents.find((a) => a.config.id === 'analysis-agent')

    // Create tasks for capable agents
    for (const agent of capableAgents) {
      // Skip analysis agent if it's handled separately
      if (hasAttachments && agent.config.id === 'analysis-agent') {
        continue
      }

      const relevantHistory = this.contextManager.extractRelevantHistory(
        request.history,
        agent.config.id.replace('-agent', '') as AgentType,
        agent.config.maxContextTokens
      )

      const task = this.createTask(agent, {
        ...agentInput,
        relevantHistory,
      })

      tasks.push(task)
    }

    // Add analysis task in parallel if attachments are present
    if (hasAttachments && analysisAgent) {
      const relevantHistory = this.contextManager.extractRelevantHistory(
        request.history,
        'analysis',
        analysisAgent.config.maxContextTokens
      )

      const analysisTask = this.createTask(analysisAgent, {
        ...agentInput,
        relevantHistory,
      })

      tasks.push(analysisTask)
    }

    // Calculate parallel groups
    const parallelGroups = this.calculateParallelGroups(tasks)

    // Estimate total tokens
    const estimatedTokens = tasks.reduce(
      (sum, t) => sum + this.contextManager.estimateTokens(t.input.userRequest),
      0
    )

    return { tasks, parallelGroups, estimatedTokens }
  }

  /**
   * Creates an AgentInput from OrchestratorRequest.
   */
  private createAgentInput(request: OrchestratorRequest): AgentInput {
    return {
      userRequest: request.userRequest,
      relevantHistory: [], // Will be populated per-agent
      attachments: request.attachments,
    }
  }

  /**
   * Creates a task for an agent.
   */
  private createTask(agent: Agent, input: AgentInput): Task {
    return {
      id: `task-${++this.taskIdCounter}`,
      agentId: agent.config.id,
      input,
      status: 'pending',
      priority: agent.config.priority,
      dependencies: [],
      createdAt: Date.now(),
    }
  }

  /**
   * Calculates groups of tasks that can run in parallel.
   */
  private calculateParallelGroups(tasks: Task[]): Task[][] {
    // For now, all tasks without dependencies can run in parallel
    // In a more complex scenario, we would analyze dependencies
    return [tasks]
  }

  /**
   * Executes the plan, running tasks in parallel where possible.
   */
  private async executePlan(
    plan: ExecutionPlan,
    onProgress?: ProgressCallback
  ): Promise<Task[]> {
    const completedTasks: Task[] = []

    for (const group of plan.parallelGroups) {
      // Update running tasks
      for (const task of group) {
        task.status = 'running'
        task.startedAt = Date.now()
      }

      this.reportProgress(onProgress, {
        totalTasks: plan.tasks.length,
        completedTasks: completedTasks.length,
        runningTasks: group,
        status: 'executing',
      })

      // Execute all tasks in the group in parallel
      const results = await Promise.all(
        group.map((task) => this.executeTask(task))
      )

      // Mark tasks as completed
      for (let i = 0; i < group.length; i++) {
        const task = group[i]
        task.output = results[i]
        task.status = 'completed'
        task.completedAt = Date.now()
        completedTasks.push(task)
      }

      this.reportProgress(onProgress, {
        totalTasks: plan.tasks.length,
        completedTasks: completedTasks.length,
        runningTasks: [],
        status: 'executing',
      })
    }

    return completedTasks
  }

  /**
   * Executes a single task, using cache if available.
   */
  private async executeTask(task: Task): Promise<AgentOutput> {
    // Check cache first
    const cacheKey = this.taskCache.generateKey(task.agentId, task.input)
    const cachedResult = this.taskCache.get(cacheKey)

    if (cachedResult) {
      return cachedResult
    }

    // Find the agent
    const agent = this.agents.find((a) => a.config.id === task.agentId)

    if (!agent) {
      return {
        content: `Agent ${task.agentId} not found`,
        metadata: { tokensUsed: 0, cached: false, duration: 0 },
      }
    }

    // Execute the task
    const result = await agent.execute(task.input)

    // Cache the result
    this.taskCache.set(cacheKey, result)

    return result
  }

  /**
   * Aggregates results from all completed tasks.
   */
  private aggregateResults(tasks: Task[], startTime: number): OrchestratorResponse {
    // Combine content from all tasks
    const contents: string[] = []
    let code: string | undefined
    let totalTokens = 0
    let cachedResults = 0

    for (const task of tasks) {
      if (task.output) {
        contents.push(task.output.content)

        // Take the first code block found
        if (!code && task.output.code) {
          code = task.output.code
        }

        totalTokens += task.output.metadata?.tokensUsed ?? 0

        if (task.output.metadata?.cached) {
          cachedResults++
        }
      }
    }

    // If multiple contents, format them nicely
    const content =
      contents.length > 1
        ? contents.map((c, i) => `### Result ${i + 1}\n${c}`).join('\n\n')
        : contents[0] || 'No results'

    return {
      content,
      code,
      tasks,
      metadata: {
        totalTokensUsed: totalTokens,
        cachedResults,
        totalDuration: Date.now() - startTime,
        tasksExecuted: tasks.length,
      },
    }
  }

  /**
   * Reports progress to the callback if provided.
   */
  private reportProgress(
    onProgress: ProgressCallback | undefined,
    progress: OrchestratorProgress
  ): void {
    if (onProgress) {
      onProgress(progress)
    }
  }

  /**
   * Clears the task cache.
   */
  clearCache(): void {
    this.taskCache.clear()
  }

  /**
   * Gets cache statistics.
   */
  getCacheStats(): { size: number; maxSize: number; maxAgeMs: number } {
    return this.taskCache.getStats()
  }
}

// Singleton instance
export const orchestrator = new Orchestrator()
