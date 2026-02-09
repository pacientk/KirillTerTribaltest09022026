import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const navbarCode = `export function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">Logo</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
                Home
              </a>
              <a href="#" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Features
              </a>
              <a href="#" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Pricing
              </a>
              <a href="#" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium transition">
              Sign In
            </button>
            <button className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}`

export class NavbarSkill implements Skill {
  config: SkillConfig = {
    id: 'navbar',
    name: 'Navbar Skill',
    description: 'Creates navigation bar components',
    triggers: ['navbar', 'navigation', 'nav', 'menu', 'header', 'topbar'],
    priority: 8,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      content:
        'Created a modern navbar with gradient background, responsive design and hover effects. Component includes logo, navigation links and action buttons.',
      code: navbarCode,
      metadata: {
        tokensUsed: 150,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const navbarSkill = new NavbarSkill()
