import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const pricingCode = `export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for side projects',
      features: ['5 projects', '10GB storage', 'Email support', 'Basic analytics'],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      features: ['Unlimited projects', '100GB storage', 'Priority support', 'Advanced analytics', 'Custom domain', 'API access'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations',
      features: ['Everything in Pro', 'Unlimited storage', '24/7 phone support', 'Custom integrations', 'SLA guarantee', 'Dedicated manager'],
      highlighted: false,
    },
  ]

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that's right for you. All plans include a 14-day free trial.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={\`rounded-2xl p-8 \${
                plan.highlighted
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl scale-105'
                  : 'bg-white border border-gray-200 shadow-sm'
              }\`}
            >
              {plan.highlighted && (
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  Most Popular
                </span>
              )}
              <h3 className={\`text-xl font-bold \${plan.highlighted ? 'text-white' : 'text-gray-900'}\`}>
                {plan.name}
              </h3>
              <p className={\`text-sm mt-2 \${plan.highlighted ? 'text-white/80' : 'text-gray-500'}\`}>
                {plan.description}
              </p>
              <div className="mt-6 mb-8">
                <span className={\`text-4xl font-bold \${plan.highlighted ? 'text-white' : 'text-gray-900'}\`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? 'text-white/70' : 'text-gray-500'}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg className={\`w-5 h-5 \${plan.highlighted ? 'text-white' : 'text-green-500'}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={\`text-sm \${plan.highlighted ? 'text-white/90' : 'text-gray-600'}\`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={\`w-full py-3 rounded-xl font-medium transition \${
                  plan.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-gray-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }\`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`

export class PricingSkill implements Skill {
  config: SkillConfig = {
    id: 'pricing',
    name: 'Pricing Skill',
    description: 'Creates pricing section components',
    triggers: ['pricing', 'price', 'plan', 'subscription', 'tier', 'package'],
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
        'Created a pricing section with plans: Starter, Pro and Enterprise. Includes badges, feature lists and buttons. Pro plan highlighted as popular.',
      code: pricingCode,
      metadata: {
        tokensUsed: 280,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const pricingSkill = new PricingSkill()
