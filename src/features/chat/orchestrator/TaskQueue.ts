import type { Task, TaskStatus } from './types'

/**
 * TaskQueue manages task scheduling with priority and dependency handling.
 * Higher priority tasks are processed first.
 * Tasks with unresolved dependencies are blocked until dependencies complete.
 */
export class TaskQueue {
  private queue: Task[] = []
  private completedTaskIds: Set<string> = new Set()

  /**
   * Adds a task to the queue, maintaining priority order.
   */
  enqueue(task: Task): void {
    // Find insertion point based on priority (higher priority = earlier in queue)
    let insertIndex = this.queue.length

    for (let i = 0; i < this.queue.length; i++) {
      if (task.priority > this.queue[i].priority) {
        insertIndex = i
        break
      }
    }

    this.queue.splice(insertIndex, 0, task)
  }

  /**
   * Adds multiple tasks to the queue.
   */
  enqueueAll(tasks: Task[]): void {
    for (const task of tasks) {
      this.enqueue(task)
    }
  }

  /**
   * Gets the next task that is ready to execute (no blocking dependencies).
   */
  dequeue(): Task | null {
    for (let i = 0; i < this.queue.length; i++) {
      const task = this.queue[i]

      if (this.isReady(task)) {
        this.queue.splice(i, 1)
        return task
      }
    }

    return null
  }

  /**
   * Gets all tasks that are ready to execute (no blocking dependencies).
   */
  getReadyTasks(): Task[] {
    return this.queue.filter((task) => this.isReady(task))
  }

  /**
   * Groups tasks for parallel execution.
   * Tasks in the same group have no dependencies on each other.
   */
  getParallelGroups(): Task[][] {
    const groups: Task[][] = []
    const processed = new Set<string>()
    const tempCompleted = new Set(this.completedTaskIds)

    while (processed.size < this.queue.length) {
      const group: Task[] = []

      for (const task of this.queue) {
        if (processed.has(task.id)) continue

        // Check if all dependencies are in tempCompleted
        const depsResolved = task.dependencies.every((depId) => tempCompleted.has(depId))

        if (depsResolved) {
          group.push(task)
          processed.add(task.id)
        }
      }

      if (group.length === 0) {
        // Circular dependency or remaining tasks all blocked
        // Add remaining tasks as final group
        const remaining = this.queue.filter((t) => !processed.has(t.id))
        if (remaining.length > 0) {
          groups.push(remaining)
        }
        break
      }

      groups.push(group)

      // Mark this group as "completed" for next iteration
      for (const task of group) {
        tempCompleted.add(task.id)
      }
    }

    return groups
  }

  /**
   * Marks a task as completed, unblocking dependent tasks.
   */
  markCompleted(taskId: string): void {
    this.completedTaskIds.add(taskId)
  }

  /**
   * Checks if a task is ready to execute (all dependencies resolved).
   */
  private isReady(task: Task): boolean {
    if (task.status !== 'pending' && task.status !== 'queued') {
      return false
    }

    return task.dependencies.every((depId) => this.completedTaskIds.has(depId))
  }

  /**
   * Updates a task's status in the queue.
   */
  updateStatus(taskId: string, status: TaskStatus): void {
    const task = this.queue.find((t) => t.id === taskId)
    if (task) {
      task.status = status
    }
  }

  /**
   * Gets the current queue size.
   */
  get size(): number {
    return this.queue.length
  }

  /**
   * Gets all tasks in the queue.
   */
  getAllTasks(): Task[] {
    return [...this.queue]
  }

  /**
   * Checks if the queue is empty.
   */
  isEmpty(): boolean {
    return this.queue.length === 0
  }

  /**
   * Clears the queue and completed task tracking.
   */
  clear(): void {
    this.queue = []
    this.completedTaskIds.clear()
  }

  /**
   * Gets tasks by status.
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.queue.filter((t) => t.status === status)
  }
}

// Singleton instance
export const taskQueue = new TaskQueue()
