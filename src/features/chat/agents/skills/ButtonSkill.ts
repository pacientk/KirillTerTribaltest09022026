import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const buttonCode = `export function ButtonShowcase() {
  return (
    <div className="p-8 bg-gray-50 rounded-xl space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Button Variants</h2>

      {/* Primary Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm">
          Primary
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm">
          Success
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm">
          Danger
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm">
          Warning
        </button>
      </div>

      {/* Outline Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-5 rounded-lg transition">
          Outline
        </button>
        <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-5 rounded-lg transition">
          Secondary
        </button>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition">
          Small
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition">
          Medium
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-7 rounded-xl transition">
          Large
        </button>
      </div>

      {/* With Icons */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm">
          Download
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  )
}`

export class ButtonSkill implements Skill {
  config: SkillConfig = {
    id: 'button',
    name: 'Button Skill',
    description: 'Creates button components',
    triggers: ['button', 'btn', 'buttons'],
    priority: 6,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 250))

    return {
      content:
        'Created a button set with various variants: primary, success, danger, warning, outline and secondary. Also shows different sizes and buttons with icons.',
      code: buttonCode,
      metadata: {
        tokensUsed: 220,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const buttonSkill = new ButtonSkill()
