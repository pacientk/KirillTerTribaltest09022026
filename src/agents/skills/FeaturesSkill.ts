import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const featuresCode = `export function Features() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Lightning Fast',
      description: 'Built for speed with optimized performance that keeps your workflow smooth.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure by Default',
      description: 'Enterprise-grade security with end-to-end encryption and compliance.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: 'Flexible Layout',
      description: 'Customize everything to match your brand and workflow preferences.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time sync and shared workspaces.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Advanced Analytics',
      description: 'Get insights with powerful dashboards and detailed reporting.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      title: 'API & Integrations',
      description: 'Connect with your favorite tools through our extensive API.',
    },
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful features to help you build, ship, and scale your products faster than ever.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`

export class FeaturesSkill implements Skill {
  config: SkillConfig = {
    id: 'features',
    name: 'Features Skill',
    description: 'Creates features/benefits section components',
    triggers: ['features', 'feature', 'benefits', 'capabilities', 'advantages'],
    priority: 6,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 360))

    return {
      content:
        'Created a features section with 6 items in a grid. Each card contains icon, title and description with hover effects.',
      code: featuresCode,
      metadata: {
        tokensUsed: 290,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const featuresSkill = new FeaturesSkill()
