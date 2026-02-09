import React, { useMemo, useState } from 'react'
import { UIPreviewProps } from './types'
import './styles.css'

function extractCodeFromMarkdown(content: string): string | null {
  // Match ```tsx or ```jsx or ```javascript code blocks
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript)\n([\s\S]*?)```/
  const match = content.match(codeBlockRegex)
  return match ? match[1].trim() : null
}

type ComponentType = 'navbar' | 'form' | 'card' | 'button' | 'modal' | 'table' | 'hero' | 'sidebar' | 'pricing' | 'footer' | 'testimonial' | 'features' | 'unknown'

function detectComponentType(code: string): ComponentType {
  const lower = code.toLowerCase()
  if (lower.includes('navbar') || lower.includes('<nav')) return 'navbar'
  if (lower.includes('form') || lower.includes('<form')) return 'form'
  if (lower.includes('card')) return 'card'
  if (lower.includes('buttonshowcase') || (lower.includes('button') && lower.includes('variant'))) return 'button'
  if (lower.includes('modal') || lower.includes('backdrop')) return 'modal'
  if (lower.includes('table') || lower.includes('<th')) return 'table'
  if (lower.includes('hero')) return 'hero'
  if (lower.includes('sidebar') || lower.includes('side menu')) return 'sidebar'
  if (lower.includes('pricing') || lower.includes('plan')) return 'pricing'
  if (lower.includes('footer')) return 'footer'
  if (lower.includes('testimonial') || lower.includes('review')) return 'testimonial'
  if (lower.includes('features')) return 'features'
  return 'unknown'
}

// Schematic preview components
function NavbarPreview() {
  return (
    <div className="w-full">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-white font-bold">Logo</span>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-white/90 text-sm">Home</span>
            <span className="text-white/70 text-sm">Features</span>
            <span className="text-white/70 text-sm">Pricing</span>
            <span className="text-white/70 text-sm">Contact</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-white/90 text-sm px-3 py-1">Sign In</button>
            <button className="bg-white text-indigo-700 text-sm px-3 py-1 rounded-lg font-medium">Get Started</button>
          </div>
        </div>
      </nav>
    </div>
  )
}

function FormPreview() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
          <div className="w-full h-9 border border-gray-300 rounded-lg bg-gray-50"></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <div className="w-full h-9 border border-gray-300 rounded-lg bg-gray-50"></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
          <div className="w-full h-20 border border-gray-300 rounded-lg bg-gray-50"></div>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm">Send Message</button>
      </div>
    </div>
  )
}

function CardPreview() {
  return (
    <div className="max-w-xs bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="p-4">
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Featured</span>
        <h4 className="font-bold text-gray-900 mt-2">Card Title</h4>
        <p className="text-gray-600 text-xs mt-1">A beautiful card component with image and content.</p>
        <button className="text-purple-600 text-xs font-medium mt-3">Read more →</button>
      </div>
    </div>
  )
}

function ButtonPreview() {
  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
      <div className="flex flex-wrap gap-2">
        <button className="bg-blue-600 text-white text-sm py-1.5 px-4 rounded-lg">Primary</button>
        <button className="bg-green-600 text-white text-sm py-1.5 px-4 rounded-lg">Success</button>
        <button className="bg-red-600 text-white text-sm py-1.5 px-4 rounded-lg">Danger</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="border-2 border-blue-600 text-blue-600 text-sm py-1 px-4 rounded-lg">Outline</button>
        <button className="border-2 border-gray-300 text-gray-700 text-sm py-1 px-4 rounded-lg">Secondary</button>
      </div>
    </div>
  )
}

function ModalPreview() {
  return (
    <div className="relative bg-black/30 rounded-xl p-4 flex items-center justify-center min-h-[200px]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-semibold text-gray-900 text-sm">Confirm Action</span>
          <span className="text-gray-400">×</span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">!</div>
            <p className="text-xs text-gray-600">Are you sure? This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-3 bg-gray-50">
          <button className="px-3 py-1 text-gray-700 text-xs rounded-lg">Cancel</button>
          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  )
}

function TablePreview() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <span className="font-semibold text-gray-900 text-sm">Users</span>
        <button className="bg-blue-600 text-white text-xs py-1 px-2 rounded">Add User</button>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-gray-500">Name</th>
            <th className="px-3 py-2 text-left text-gray-500">Role</th>
            <th className="px-3 py-2 text-left text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr><td className="px-3 py-2">John Doe</td><td className="px-3 py-2">Admin</td><td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Active</span></td></tr>
          <tr><td className="px-3 py-2">Jane Smith</td><td className="px-3 py-2">Editor</td><td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Active</span></td></tr>
        </tbody>
      </table>
    </div>
  )
}

function HeroPreview() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-xl p-6 text-center">
      <span className="inline-block px-2 py-1 bg-white/10 rounded-full text-xs text-white/90 mb-3">New feature</span>
      <h2 className="text-xl font-bold text-white mb-2">Build Amazing Products</h2>
      <p className="text-white/70 text-xs mb-4 max-w-xs mx-auto">The modern platform for teams to collaborate and ship faster.</p>
      <div className="flex justify-center gap-2">
        <button className="bg-white text-indigo-900 text-xs font-medium py-1.5 px-4 rounded-lg">Get Started</button>
        <button className="text-white text-xs py-1.5 px-4 rounded-lg border border-white/30">Watch Demo</button>
      </div>
    </div>
  )
}

function SidebarPreview() {
  return (
    <div className="w-48 bg-gray-900 rounded-xl p-3 text-white">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">A</div>
        <span className="font-semibold text-sm">Acme Inc</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-600 rounded-lg text-xs">
          <span>◉</span> Dashboard
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-gray-400 text-xs">
          <span>◉</span> Team
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-gray-400 text-xs">
          <span>◉</span> Projects
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-gray-400 text-xs">
          <span>◉</span> Settings
        </div>
      </div>
    </div>
  )
}

function PricingPreview() {
  return (
    <div className="w-full p-4 bg-gray-50 rounded-xl">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Pricing Plans</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-lg p-3 border text-center">
          <div className="text-xs text-gray-500">Starter</div>
          <div className="text-lg font-bold">$9</div>
          <div className="text-xs text-gray-400">/mo</div>
        </div>
        <div className="bg-indigo-600 rounded-lg p-3 text-center text-white scale-105">
          <div className="text-xs text-white/80">Pro</div>
          <div className="text-lg font-bold">$29</div>
          <div className="text-xs text-white/70">/mo</div>
        </div>
        <div className="bg-white rounded-lg p-3 border text-center">
          <div className="text-xs text-gray-500">Enterprise</div>
          <div className="text-lg font-bold">$99</div>
          <div className="text-xs text-gray-400">/mo</div>
        </div>
      </div>
    </div>
  )
}

function FooterPreview() {
  return (
    <div className="w-full bg-gray-900 rounded-xl p-4 text-white">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-500 rounded"></div>
          <span className="text-sm font-bold">Acme</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          <span>Product</span>
          <span>Company</span>
          <span>Resources</span>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">© 2024 Acme Inc.</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function TestimonialPreview() {
  return (
    <div className="w-full p-4">
      <div className="text-center mb-3">
        <h3 className="text-sm font-bold text-gray-900">What People Say</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3">
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-yellow-400 text-xs">★</span>
              ))}
            </div>
            <p className="text-xs text-gray-600 mb-2">"Amazing product!"</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-400"></div>
              <div className="text-xs text-gray-700">User {i}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesPreview() {
  return (
    <div className="w-full p-4">
      <div className="text-center mb-3">
        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">Features</span>
        <h3 className="text-sm font-bold text-gray-900 mt-2">Everything You Need</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['Fast', 'Secure', 'Flexible', 'Team', 'Analytics', 'API'].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="w-6 h-6 bg-indigo-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
              <span className="text-indigo-600 text-xs">✓</span>
            </div>
            <div className="text-xs text-gray-700">{f}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UnknownPreview() {
  return (
    <div className="text-center text-gray-500 p-4">
      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p>Component Preview</p>
      <p className="text-sm">Switch to Code tab to see the code</p>
    </div>
  )
}

const previewComponents: Record<ComponentType, () => React.ReactNode> = {
  navbar: NavbarPreview,
  form: FormPreview,
  card: CardPreview,
  button: ButtonPreview,
  modal: ModalPreview,
  table: TablePreview,
  hero: HeroPreview,
  sidebar: SidebarPreview,
  pricing: PricingPreview,
  footer: FooterPreview,
  testimonial: TestimonialPreview,
  features: FeaturesPreview,
  unknown: UnknownPreview,
}

export function UIPreview({ code, className = '' }: UIPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [error] = useState<string | null>(null)

  const extractedCode = useMemo(() => {
    return extractCodeFromMarkdown(code) || code
  }, [code])

  const componentType = useMemo(() => {
    return detectComponentType(extractedCode)
  }, [extractedCode])

  const PreviewComponent = previewComponents[componentType]

  if (!code || code.trim() === '') {
    return null
  }

  return (
    <div
      className={`ui-preview border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden ${className}`}
    >
      <div className="preview-header flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`tab-btn flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          aria-selected={activeTab === 'preview'}
          role="tab"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`tab-btn flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'code'
              ? 'bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          aria-selected={activeTab === 'code'}
          role="tab"
        >
          Code
        </button>
      </div>

      <div className="preview-content p-4">
        {activeTab === 'preview' ? (
          <div className="preview-area bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {error ? (
              <div className="text-red-500 text-center">
                <p className="font-medium">Preview Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <PreviewComponent />
            )}
          </div>
        ) : (
          <div className="code-area">
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
              <code>{extractedCode}</code>
            </pre>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(extractedCode)}
              className="copy-btn mt-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Copy Code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
