import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const formCode = `export function ContactForm() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
      <form className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            placeholder="Your message..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-sm"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}`

export class FormSkill implements Skill {
  config: SkillConfig = {
    id: 'form',
    name: 'Form Skill',
    description: 'Creates form components',
    triggers: ['form', 'input', 'field', 'contact', 'registration', 'login', 'signup'],
    priority: 7,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 350))

    return {
      content:
        'Created a contact form with name, email and message fields. Form includes focus validation, smooth transitions and responsive design.',
      code: formCode,
      metadata: {
        tokensUsed: 180,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const formSkill = new FormSkill()
