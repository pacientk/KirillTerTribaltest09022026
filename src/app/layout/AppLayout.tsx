import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout min-h-screen bg-gray-100 dark:bg-gray-950">
      {children}
    </div>
  )
}
