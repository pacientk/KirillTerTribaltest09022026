import { StatusIndicatorProps } from './types'
import './styles.css'

const statusConfig: Record<string, { label: string; color: string; animate: boolean }> = {
  idle: { label: '', color: 'bg-gray-400', animate: false },
  typing: { label: 'Typing...', color: 'bg-blue-500', animate: true },
  loading: { label: 'Loading...', color: 'bg-yellow-500', animate: true },
  generating: { label: 'Generating UI...', color: 'bg-purple-500', animate: true },
  error: { label: 'Error occurred', color: 'bg-red-500', animate: false },
  success: { label: 'Done!', color: 'bg-green-500', animate: false },
}

export function StatusIndicator({ status, className = '' }: StatusIndicatorProps) {
  if (status === 'idle') {
    return null
  }

  const config = statusConfig[status]

  return (
    <div
      className={`status-indicator flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`status-dot w-2 h-2 rounded-full ${config.color} ${config.animate ? 'animate-pulse' : ''}`}
      />
      <span className="text-gray-700 dark:text-gray-300">{config.label}</span>
    </div>
  )
}
