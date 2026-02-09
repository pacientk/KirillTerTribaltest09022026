import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const cardCode = `export function Card() {
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            Featured
          </span>
          <span className="text-gray-400 text-sm">5 min read</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Beautiful Card Component
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          A versatile card component with image placeholder, badges, and call-to-action button.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <span className="text-sm text-gray-700">John Doe</span>
          </div>
          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition">
            Read more →
          </button>
        </div>
      </div>
    </div>
  )
}`

export class CardSkill implements Skill {
  config: SkillConfig = {
    id: 'card',
    name: 'Card Skill',
    description: 'Creates card components',
    triggers: ['card', 'tile', 'block', 'panel'],
    priority: 7,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 280))

    return {
      content:
        'Created a card with image placeholder, badges, title, description and author footer. Includes hover effects and responsive design.',
      code: cardCode,
      metadata: {
        tokensUsed: 200,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const cardSkill = new CardSkill()
