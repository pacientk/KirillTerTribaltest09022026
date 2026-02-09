import { ReactNode } from 'react'
import { AppLayout } from './layout'

interface AppProps {
  children: ReactNode
}

export function App({ children }: AppProps) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
