import React, { useMemo, useState } from 'react'
import { Eye, Code2, Copy, Check } from 'lucide-react'
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
      <nav className="rounded-lg" style={{ background: 'hsl(var(--secondary))' }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="font-bold" style={{ color: 'hsl(var(--primary))' }}>Logo</span>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm" style={{ color: 'hsl(var(--foreground))' }}>Home</span>
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Features</span>
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Pricing</span>
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Contact</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm px-3 py-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Sign In</button>
            <button className="text-sm px-3 py-1 rounded-lg font-medium" style={{ background: 'hsl(var(--primary))', color: 'white' }}>Get Started</button>
          </div>
        </div>
      </nav>
    </div>
  )
}

function FormPreview() {
  return (
    <div className="max-w-sm mx-auto rounded-xl p-6" style={{ background: 'hsl(var(--secondary))' }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>Contact Us</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Name</label>
          <div className="w-full h-9 rounded-lg" style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}></div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Email</label>
          <div className="w-full h-9 rounded-lg" style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}></div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Message</label>
          <div className="w-full h-20 rounded-lg" style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}></div>
        </div>
        <button className="w-full py-2 rounded-lg font-medium text-sm" style={{ background: 'hsl(var(--primary))', color: 'white' }}>Send Message</button>
      </div>
    </div>
  )
}

function CardPreview() {
  return (
    <div className="max-w-xs rounded-xl overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
      <div className="h-32 flex items-center justify-center" style={{ background: 'hsl(var(--primary))' }}>
        <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="p-4">
        <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--primary))' }}>Featured</span>
        <h4 className="font-bold mt-2" style={{ color: 'hsl(var(--foreground))' }}>Card Title</h4>
        <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>A beautiful card component with image and content.</p>
        <button className="text-xs font-medium mt-3" style={{ color: 'hsl(var(--primary))' }}>Read more</button>
      </div>
    </div>
  )
}

function ButtonPreview() {
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ background: 'hsl(var(--secondary))' }}>
      <div className="flex flex-wrap gap-2">
        <button className="text-sm py-1.5 px-4 rounded-lg text-white" style={{ background: 'hsl(var(--primary))' }}>Primary</button>
        <button className="text-sm py-1.5 px-4 rounded-lg text-white" style={{ background: 'hsl(var(--accent-green))' }}>Success</button>
        <button className="text-sm py-1.5 px-4 rounded-lg text-white" style={{ background: 'hsl(var(--accent-red))' }}>Danger</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="text-sm py-1 px-4 rounded-lg" style={{ border: '2px solid hsl(var(--primary))', color: 'hsl(var(--primary))' }}>Outline</button>
        <button className="text-sm py-1 px-4 rounded-lg" style={{ border: '2px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>Secondary</button>
      </div>
    </div>
  )
}

function ModalPreview() {
  return (
    <div className="relative rounded-xl p-4 flex items-center justify-center min-h-[200px]" style={{ background: 'hsl(var(--muted))' }}>
      <div className="rounded-xl w-full max-w-xs overflow-hidden" style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
        <div className="flex items-center justify-between p-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
          <span className="font-semibold text-sm" style={{ color: 'hsl(var(--foreground))' }}>Confirm Action</span>
          <span style={{ color: 'hsl(var(--muted-foreground))' }}>x</span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--accent-yellow) / 0.2)', color: 'hsl(var(--accent-yellow))' }}>!</div>
            <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Are you sure? This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-3" style={{ background: 'hsl(var(--muted))' }}>
          <button className="px-3 py-1 text-xs rounded-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>Cancel</button>
          <button className="px-3 py-1 text-xs rounded-lg text-white" style={{ background: 'hsl(var(--accent-red))' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function TablePreview() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
      <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <span className="font-semibold text-sm" style={{ color: 'hsl(var(--foreground))' }}>Users</span>
        <button className="text-xs py-1 px-2 rounded text-white" style={{ background: 'hsl(var(--primary))' }}>Add User</button>
      </div>
      <table className="w-full text-xs">
        <thead style={{ background: 'hsl(var(--muted))' }}>
          <tr>
            <th className="px-3 py-2 text-left" style={{ color: 'hsl(var(--muted-foreground))' }}>Name</th>
            <th className="px-3 py-2 text-left" style={{ color: 'hsl(var(--muted-foreground))' }}>Role</th>
            <th className="px-3 py-2 text-left" style={{ color: 'hsl(var(--muted-foreground))' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
            <td className="px-3 py-2" style={{ color: 'hsl(var(--foreground))' }}>John Doe</td>
            <td className="px-3 py-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Admin</td>
            <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'hsl(var(--accent-green) / 0.2)', color: 'hsl(var(--accent-green))' }}>Active</span></td>
          </tr>
          <tr>
            <td className="px-3 py-2" style={{ color: 'hsl(var(--foreground))' }}>Jane Smith</td>
            <td className="px-3 py-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Editor</td>
            <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'hsl(var(--accent-green) / 0.2)', color: 'hsl(var(--accent-green))' }}>Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function HeroPreview() {
  return (
    <div className="rounded-xl p-6 text-center" style={{ background: 'hsl(var(--secondary))' }}>
      <span className="inline-block px-2 py-1 rounded-full text-xs mb-3" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--primary))' }}>New feature</span>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>Build Amazing Products</h2>
      <p className="text-xs mb-4 max-w-xs mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>The modern platform for teams to collaborate and ship faster.</p>
      <div className="flex justify-center gap-2">
        <button className="text-xs font-medium py-1.5 px-4 rounded-lg text-white" style={{ background: 'hsl(var(--primary))' }}>Get Started</button>
        <button className="text-xs py-1.5 px-4 rounded-lg" style={{ border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>Watch Demo</button>
      </div>
    </div>
  )
}

function SidebarPreview() {
  return (
    <div className="w-48 rounded-xl p-3" style={{ background: 'hsl(var(--secondary))' }}>
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ background: 'hsl(var(--primary))' }}>A</div>
        <span className="font-semibold text-sm" style={{ color: 'hsl(var(--foreground))' }}>Acme Inc</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white" style={{ background: 'hsl(var(--primary))' }}>
          Dashboard
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Team
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Projects
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Settings
        </div>
      </div>
    </div>
  )
}

function PricingPreview() {
  return (
    <div className="w-full p-4 rounded-xl" style={{ background: 'hsl(var(--secondary))' }}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'hsl(var(--foreground))' }}>Pricing Plans</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg p-3 text-center" style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
          <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Starter</div>
          <div className="text-lg font-bold" style={{ color: 'hsl(var(--foreground))' }}>$9</div>
          <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>/mo</div>
        </div>
        <div className="rounded-lg p-3 text-center text-white scale-105" style={{ background: 'hsl(var(--primary))' }}>
          <div className="text-xs text-white/80">Pro</div>
          <div className="text-lg font-bold">$29</div>
          <div className="text-xs text-white/70">/mo</div>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
          <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Enterprise</div>
          <div className="text-lg font-bold" style={{ color: 'hsl(var(--foreground))' }}>$99</div>
          <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>/mo</div>
        </div>
      </div>
    </div>
  )
}

function FooterPreview() {
  return (
    <div className="w-full rounded-xl p-4" style={{ background: 'hsl(var(--secondary))' }}>
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ background: 'hsl(var(--primary))' }}></div>
          <span className="text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>Acme</span>
        </div>
        <div className="flex gap-4 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <span>Product</span>
          <span>Company</span>
          <span>Resources</span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid hsl(var(--border))' }}>
        <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>2024 Acme Inc.</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'hsl(var(--muted))' }}></div>
          <div className="w-4 h-4 rounded" style={{ background: 'hsl(var(--muted))' }}></div>
        </div>
      </div>
    </div>
  )
}

function TestimonialPreview() {
  return (
    <div className="w-full p-4">
      <div className="text-center mb-3">
        <h3 className="text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>What People Say</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg p-3" style={{ background: 'hsl(var(--secondary))' }}>
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-xs" style={{ color: 'hsl(var(--accent-yellow))' }}>*</span>
              ))}
            </div>
            <p className="text-xs mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>"Amazing product!"</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full" style={{ background: 'hsl(var(--primary))' }}></div>
              <div className="text-xs" style={{ color: 'hsl(var(--foreground))' }}>User {i}</div>
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
        <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--primary))' }}>Features</span>
        <h3 className="text-sm font-bold mt-2" style={{ color: 'hsl(var(--foreground))' }}>Everything You Need</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['Fast', 'Secure', 'Flexible', 'Team', 'Analytics', 'API'].map((f) => (
          <div key={f} className="rounded-lg p-2 text-center" style={{ background: 'hsl(var(--secondary))' }}>
            <div className="w-6 h-6 rounded-lg mx-auto mb-1 flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
              <span className="text-xs" style={{ color: 'hsl(var(--primary))' }}>*</span>
            </div>
            <div className="text-xs" style={{ color: 'hsl(var(--foreground))' }}>{f}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UnknownPreview() {
  return (
    <div className="text-center p-4">
      <svg className="w-12 h-12 mx-auto mb-2" style={{ color: 'hsl(var(--border))' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p style={{ color: 'hsl(var(--muted-foreground))' }}>Component Preview</p>
      <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Switch to Code tab to see the code</p>
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
  const [copied, setCopied] = useState(false)
  const [error] = useState<string | null>(null)

  const extractedCode = useMemo(() => {
    return extractCodeFromMarkdown(code) || code
  }, [code])

  const componentType = useMemo(() => {
    return detectComponentType(extractedCode)
  }, [extractedCode])

  const PreviewComponent = previewComponents[componentType]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(extractedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!code || code.trim() === '') {
    return null
  }

  return (
    <div
      className={`ui-preview rounded-xl overflow-hidden ${className}`}
      style={{ border: '1px solid hsl(var(--border))' }}
    >
      {/* Tab header */}
      <div className="flex" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium transition-colors`}
          style={{
            background: activeTab === 'preview' ? 'hsl(var(--secondary))' : 'hsl(var(--muted))',
            color: activeTab === 'preview' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            borderBottom: activeTab === 'preview' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
          }}
          aria-selected={activeTab === 'preview'}
          role="tab"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium transition-colors`}
          style={{
            background: activeTab === 'code' ? 'hsl(var(--secondary))' : 'hsl(var(--muted))',
            color: activeTab === 'code' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            borderBottom: activeTab === 'code' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
          }}
          aria-selected={activeTab === 'code'}
          role="tab"
        >
          <Code2 className="w-4 h-4" />
          Code
        </button>
      </div>

      {/* Content */}
      <div className="p-4" style={{ background: 'hsl(var(--background))' }}>
        {activeTab === 'preview' ? (
          <div className="preview-area rounded-lg p-4 min-h-[200px] flex items-center justify-center" style={{ background: 'hsl(220 14% 25%)' }}>
            {error ? (
              <div className="text-center" style={{ color: 'hsl(var(--accent-red))' }}>
                <p className="font-medium">Preview Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <PreviewComponent />
            )}
          </div>
        ) : (
          <div className="code-area">
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid hsl(var(--code-border))' }}>
              <div className="flex items-center justify-between px-4 py-2" style={{ background: 'hsl(var(--secondary))' }}>
                <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))', fontFamily: "'JetBrains Mono', monospace" }}>tsx</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`copy-button ${copied ? 'copied' : ''}`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre
                className="overflow-x-auto"
                style={{
                  background: 'hsl(var(--code-bg))',
                  margin: 0,
                }}
              >
                <code
                  className="block p-4 text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'hsl(var(--foreground))',
                  }}
                >
                  {extractedCode}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
