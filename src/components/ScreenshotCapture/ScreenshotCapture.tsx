import { useScreenshot } from '../../hooks/useScreenshot'
import { ScreenshotCaptureProps } from './types'
import { useEffect } from 'react'
import './styles.css'

export function ScreenshotCapture({
  onCapture,
  disabled = false,
  className = '',
}: ScreenshotCaptureProps) {
  const { screenshot, isCapturing, error, capture, clear } = useScreenshot()

  useEffect(() => {
    if (screenshot) {
      onCapture(screenshot)
      clear()
    }
  }, [screenshot, onCapture, clear])

  return (
    <div className={`screenshot-capture ${className}`}>
      <button
        type="button"
        onClick={capture}
        disabled={disabled || isCapturing}
        className={`capture-btn flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isCapturing
            ? 'bg-purple-100 dark:bg-purple-900 text-purple-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Capture screenshot"
      >
        {isCapturing ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Capturing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Capture Screen</span>
          </>
        )}
      </button>

      {error && (
        <div className="error-message mt-2 text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
