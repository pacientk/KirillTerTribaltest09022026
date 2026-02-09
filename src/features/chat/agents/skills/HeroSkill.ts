import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const heroCode = `export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-white/90">New feature released</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Build Amazing Products
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              Faster Than Ever
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/70 mb-10">
            The modern platform for teams to collaborate, build, and ship products at lightning speed.
            Start your journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-indigo-900 font-semibold py-3 px-8 rounded-xl transition shadow-lg shadow-white/25">
              Get Started Free
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-white hover:bg-white/10 font-medium py-3 px-8 rounded-xl transition border border-white/30">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white">10k+</div>
              <div className="text-sm text-white/60">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/60">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`

export class HeroSkill implements Skill {
  config: SkillConfig = {
    id: 'hero',
    name: 'Hero Skill',
    description: 'Creates hero section components',
    triggers: ['hero', 'banner', 'landing', 'header', 'jumbotron'],
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
        'Created a hero section with gradient background, new feature badge, animated heading, description, two CTA buttons and stats block.',
      code: heroCode,
      metadata: {
        tokensUsed: 250,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const heroSkill = new HeroSkill()
