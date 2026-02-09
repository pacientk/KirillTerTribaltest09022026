import type { AgentInput, AgentOutput } from '../types'
import type { Skill, SkillConfig } from './types'

const sidebarCode = `export function Sidebar() {
  const menuItems = [
    { icon: 'home', label: 'Dashboard', active: true },
    { icon: 'users', label: 'Team', badge: '3' },
    { icon: 'folder', label: 'Projects' },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'chart', label: 'Analytics' },
    { icon: 'settings', label: 'Settings' },
  ]

  const Icon = ({ name }: { name: string }) => {
    const icons: Record<string, JSX.Element> = {
      home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      folder: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
      calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icons[name]}
      </svg>
    )
  }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-semibold text-lg">Acme Inc</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={\`flex items-center justify-between px-4 py-3 rounded-lg transition \${
              item.active
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }\`}
          >
            <div className="flex items-center gap-3">
              <Icon name={item.icon} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">John Doe</div>
            <div className="text-xs text-gray-500 truncate">john@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}`

export class SidebarSkill implements Skill {
  config: SkillConfig = {
    id: 'sidebar',
    name: 'Sidebar Skill',
    description: 'Creates sidebar navigation components',
    triggers: ['sidebar', 'side menu', 'side panel', 'drawer', 'navigation panel'],
    priority: 7,
  }

  matches(input: AgentInput): boolean {
    const content = input.userRequest.toLowerCase()
    return this.config.triggers.some((trigger) => content.includes(trigger))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now()

    await new Promise((resolve) => setTimeout(resolve, 380))

    return {
      content:
        'Created a sidebar with company logo, icon navigation menu, notification badges and user profile section at the bottom.',
      code: sidebarCode,
      metadata: {
        tokensUsed: 320,
        cached: false,
        duration: Date.now() - startTime,
        skillUsed: this.config.id,
      },
    }
  }
}

export const sidebarSkill = new SidebarSkill()
