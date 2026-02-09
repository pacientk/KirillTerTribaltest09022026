import type { Skill, SkillMatch } from './types'
import type { AgentInput } from '../types'

import { navbarSkill } from './NavbarSkill'
import { formSkill } from './FormSkill'
import { cardSkill } from './CardSkill'
import { buttonSkill } from './ButtonSkill'
import { modalSkill } from './ModalSkill'
import { tableSkill } from './TableSkill'
import { heroSkill } from './HeroSkill'
import { sidebarSkill } from './SidebarSkill'
import { pricingSkill } from './PricingSkill'
import { footerSkill } from './FooterSkill'
import { testimonialSkill } from './TestimonialSkill'
import { featuresSkill } from './FeaturesSkill'

// Export all skills
export { navbarSkill } from './NavbarSkill'
export { formSkill } from './FormSkill'
export { cardSkill } from './CardSkill'
export { buttonSkill } from './ButtonSkill'
export { modalSkill } from './ModalSkill'
export { tableSkill } from './TableSkill'
export { heroSkill } from './HeroSkill'
export { sidebarSkill } from './SidebarSkill'
export { pricingSkill } from './PricingSkill'
export { footerSkill } from './FooterSkill'
export { testimonialSkill } from './TestimonialSkill'
export { featuresSkill } from './FeaturesSkill'

// Export types
export * from './types'

// Skill registry - all available skills
const skillRegistry: Map<string, Skill> = new Map([
  ['navbar', navbarSkill],
  ['form', formSkill],
  ['card', cardSkill],
  ['button', buttonSkill],
  ['modal', modalSkill],
  ['table', tableSkill],
  ['hero', heroSkill],
  ['sidebar', sidebarSkill],
  ['pricing', pricingSkill],
  ['footer', footerSkill],
  ['testimonial', testimonialSkill],
  ['features', featuresSkill],
])

/**
 * Gets a skill by its ID.
 */
export function getSkill(id: string): Skill | undefined {
  return skillRegistry.get(id)
}

/**
 * Gets all available skills.
 */
export function getAllSkills(): Skill[] {
  return Array.from(skillRegistry.values())
}

/**
 * Gets skills for specific skill IDs.
 */
export function getSkillsById(ids: string[]): Skill[] {
  return ids.map((id) => skillRegistry.get(id)).filter((s): s is Skill => s !== undefined)
}

/**
 * Finds matching skills for an input, sorted by priority and confidence.
 */
export function findMatchingSkills(input: AgentInput, skillIds?: string[]): SkillMatch[] {
  const skills = skillIds ? getSkillsById(skillIds) : getAllSkills()

  const matches: SkillMatch[] = []

  for (const skill of skills) {
    if (skill.matches(input)) {
      // Calculate confidence based on trigger match count
      const content = input.userRequest.toLowerCase()
      const matchCount = skill.config.triggers.filter((t) => content.includes(t)).length
      const confidence = Math.min(1, matchCount * 0.3 + 0.4)

      matches.push({ skill, confidence })
    }
  }

  // Sort by priority first, then confidence
  return matches.sort((a, b) => {
    if (a.skill.config.priority !== b.skill.config.priority) {
      return b.skill.config.priority - a.skill.config.priority
    }
    return b.confidence - a.confidence
  })
}

/**
 * Finds the best matching skill for an input.
 */
export function findBestSkill(input: AgentInput, skillIds?: string[]): Skill | null {
  const matches = findMatchingSkills(input, skillIds)
  return matches.length > 0 ? matches[0].skill : null
}
