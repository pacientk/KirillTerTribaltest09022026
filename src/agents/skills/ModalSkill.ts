import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const modalCode = `export function Modal() {
  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Confirm Action
            </h3>
            <button className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Are you sure?</h4>
                <p className="text-sm text-gray-500">
                  This action cannot be undone. All data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 bg-gray-50">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition">
              Cancel
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}`

export class ModalSkill implements Skill {
  config: SkillConfig = {
    id: 'modal',
    name: 'Modal Skill',
    description: 'Creates modal/dialog components',
    triggers: ['modal', 'dialog', 'popup', 'overlay', 'window'],
    priority: 6,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 320))

    return {
      content:
        'Created a confirmation modal with backdrop-blur effect, title, warning icon, text and action buttons. Includes entrance animation.',
      code: modalCode,
      metadata: {
        tokensUsed: 190,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const modalSkill = new ModalSkill()
