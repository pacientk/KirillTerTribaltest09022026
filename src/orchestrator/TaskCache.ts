import type { AgentInput, AgentOutput } from '../agents/types'
import type { CacheEntry } from './types'

/**
 * TaskCache provides caching for agent outputs to avoid redundant processing.
 * Uses content-based hashing for cache keys.
 */
export class TaskCache {
  private cache: Map<string, CacheEntry> = new Map()
  private maxAge: number
  private maxSize: number

  constructor(maxAgeMs: number = 5 * 60 * 1000, maxSize: number = 100) {
    this.maxAge = maxAgeMs
    this.maxSize = maxSize
  }

  /**
   * Generates a cache key from agent input.
   * Key is based on user request and attachment names/types.
   */
  generateKey(agentId: string, input: AgentInput): string {
    const parts = [
      agentId,
      input.userRequest.toLowerCase().trim(),
      input.attachments?.map((a) => `${a.type}:${a.name}`).join(',') || '',
    ]

    return this.hashString(parts.join('|'))
  }

  /**
   * Simple string hash function.
   */
  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  /**
   * Gets a cached result if it exists and is not expired.
   */
  get(key: string): AgentOutput | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    // Update hit count
    entry.hits++

    // Return with cached flag in metadata
    return {
      ...entry.output,
      metadata: {
        ...entry.output.metadata,
        tokensUsed: entry.output.metadata?.tokensUsed ?? 0,
        cached: true,
        duration: 0,
      },
    }
  }

  /**
   * Stores a result in the cache.
   */
  set(key: string, output: AgentOutput): void {
    // Cleanup if at max size
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      key,
      output,
      timestamp: Date.now(),
      hits: 0,
    })
  }

  /**
   * Checks if a key exists and is valid.
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Removes expired entries from the cache.
   */
  cleanup(): void {
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Evicts the oldest entry from the cache.
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * Clears the entire cache.
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Returns cache statistics.
   */
  getStats(): { size: number; maxSize: number; maxAgeMs: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      maxAgeMs: this.maxAge,
    }
  }
}

// Singleton instance with 5-minute TTL
export const taskCache = new TaskCache()
