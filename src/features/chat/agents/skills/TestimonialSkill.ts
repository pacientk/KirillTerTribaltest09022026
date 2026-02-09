import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const testimonialCode = `export function Testimonials() {
  const testimonials = [
    {
      quote: "This product has completely transformed how our team works. The efficiency gains are incredible.",
      author: "Sarah Chen",
      role: "CTO at TechCorp",
      avatar: "SC",
      rating: 5,
    },
    {
      quote: "I've tried many similar tools, but nothing comes close. The UX is intuitive and the support team is amazing.",
      author: "Michael Rodriguez",
      role: "Product Manager at StartupXYZ",
      avatar: "MR",
      rating: 5,
    },
    {
      quote: "Within a month of using this, we saw a 40% increase in productivity. Highly recommend!",
      author: "Emily Watson",
      role: "CEO at DesignStudio",
      avatar: "EW",
      rating: 5,
    },
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Thousands</h2>
          <p className="text-gray-600">See what our customers have to say about us</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-6 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-2">
                {[...Array(item.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">"{item.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                  {item.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.author}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`

export class TestimonialSkill implements Skill {
  config: SkillConfig = {
    id: 'testimonial',
    name: 'Testimonial Skill',
    description: 'Creates testimonial/review section components',
    triggers: ['testimonial', 'review', 'reviews', 'feedback', 'rating', 'quote'],
    priority: 6,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 340))

    return {
      content:
        'Created a testimonials section with three cards. Each includes quote icon, star rating, review text and author info with avatar.',
      code: testimonialCode,
      metadata: {
        tokensUsed: 270,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const testimonialSkill = new TestimonialSkill()
