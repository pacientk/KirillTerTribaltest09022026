import { Message } from '../types'

export type TaskStatus = 'received' | 'thinking' | 'generating' | 'completed'

export interface TaskProgress {
  status: TaskStatus
  message: string
}

const MOCK_COMPONENTS: Record<string, { description: string; code: string }> = {
  navbar: {
    description: "Here's a modern responsive navbar component with logo, navigation links, and a mobile menu toggle.",
    code: `function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">Logo</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-indigo-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">Features</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600">About</a>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Sign Up
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Home</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Features</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Pricing</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">About</a>
        </div>
      )}
    </nav>
  )
}`,
  },
  button: {
    description: "Here's a versatile button component with multiple variants and sizes.",
    code: `interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled
}: ButtonProps) {
  const baseStyles = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2"

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
    >
      {children}
    </button>
  )
}`,
  },
  card: {
    description: "Here's a flexible card component with image, title, description, and action buttons.",
    code: `interface CardProps {
  image?: string
  title: string
  description: string
  tags?: string[]
  onAction?: () => void
}

function Card({ image, title, description, tags, onAction }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <div className="h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        {tags && (
          <div className="flex gap-2 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        <button
          onClick={onAction}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  )
}`,
  },
  form: {
    description: "Here's a complete login form with email, password fields, and validation styling.",
    code: `function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    // Handle login logic
    console.log('Login:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <a href="#" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}`,
  },
  modal: {
    description: "Here's a reusable modal dialog component with overlay and close functionality.",
    code: `interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {children}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}`,
  },
  table: {
    description: "Here's a data table component with sorting, hover states, and clean styling.",
    code: `interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'inactive' },
]

function DataTable() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {user.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={\`px-2 py-1 text-xs rounded-full \${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }\`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}`,
  },
  sidebar: {
    description: "Here's a collapsible sidebar navigation with icons and active states.",
    code: `function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className={\`\${collapsed ? 'w-16' : 'w-64'} bg-gray-900 min-h-screen transition-all duration-300\`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <span className="text-xl font-bold text-white">AppName</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-8 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={\`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors \${
              active === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }\`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}`,
  },
  hero: {
    description: "Here's a stunning hero section with gradient background, headline, and CTA buttons.",
    code: `function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
          ✨ Introducing v2.0
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Build Amazing
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
            User Interfaces
          </span>
        </h1>

        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Create stunning, responsive designs in minutes with our AI-powered UI builder.
          No coding required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Get Started Free
          </button>
          <button className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20">
            Watch Demo →
          </button>
        </div>
      </div>
    </section>
  )
}`,
  },
}

const DEFAULT_RESPONSE = {
  description: "I've created a basic component based on your request. Feel free to customize it!",
  code: `function Component() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Custom Component
      </h2>
      <p className="text-gray-600">
        This is a placeholder component. Describe what you need more specifically!
      </p>
      <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Click Me
      </button>
    </div>
  )
}`,
}

function detectComponentType(message: string): string | null {
  const lowerMessage = message.toLowerCase()

  const keywords: Record<string, string[]> = {
    navbar: ['navbar', 'nav bar', 'navigation', 'header', 'menu bar', 'top bar'],
    button: ['button', 'btn', 'cta'],
    card: ['card', 'tile', 'product card', 'info card'],
    form: ['form', 'login', 'signin', 'sign in', 'signup', 'sign up', 'register', 'input form'],
    modal: ['modal', 'dialog', 'popup', 'pop up', 'overlay'],
    table: ['table', 'data table', 'grid', 'list view', 'data grid'],
    sidebar: ['sidebar', 'side bar', 'side menu', 'drawer', 'navigation menu'],
    hero: ['hero', 'hero section', 'landing', 'banner', 'jumbotron', 'header section'],
  }

  for (const [component, terms] of Object.entries(keywords)) {
    if (terms.some((term) => lowerMessage.includes(term))) {
      return component
    }
  }

  return null
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendMockMessage(
  _history: Message[],
  newMessage: Message,
  onProgress: (progress: TaskProgress) => void
): Promise<string> {
  // Step 1: Received
  onProgress({ status: 'received', message: 'Request received...' })
  await delay(500)

  // Step 2: Thinking
  onProgress({ status: 'thinking', message: 'Analyzing your request...' })
  await delay(1000)

  // Step 3: Generating
  onProgress({ status: 'generating', message: 'Generating component...' })
  await delay(1500)

  // Detect component type
  const componentType = detectComponentType(newMessage.content)
  const component = componentType ? MOCK_COMPONENTS[componentType] : DEFAULT_RESPONSE

  // Step 4: Completed
  onProgress({ status: 'completed', message: 'Done!' })

  return `${component.description}

\`\`\`tsx
${component.code}
\`\`\``
}
