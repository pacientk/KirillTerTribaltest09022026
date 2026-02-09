import { useState, useCallback } from 'react'
import { FileUploadResult } from '../types'

export interface UseScreenshotReturn {
  screenshot: FileUploadResult | null
  isCapturing: boolean
  error: string | null
  capture: () => Promise<void>
  clear: () => void
}

export function useScreenshot(): UseScreenshotReturn {
  const [screenshot, setScreenshot] = useState<FileUploadResult | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const capture = useCallback(async () => {
    setError(null)
    setIsCapturing(true)

    try {
      // Check if getDisplayMedia is available
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error('Screen capture is not supported in this browser')
      }

      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window',
        },
      })

      // Create video element to capture frame
      const video = document.createElement('video')
      video.srcObject = stream

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play()
          resolve()
        }
      })

      // Wait a bit for the video to render
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Capture frame to canvas
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      ctx.drawImage(video, 0, 0)

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop())

      // Convert to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      if (!blob) {
        throw new Error('Failed to create screenshot')
      }

      const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' })
      const preview = canvas.toDataURL('image/png')

      setScreenshot({
        file,
        preview,
        type: 'image',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to capture screenshot'
      // Don't show error if user cancelled
      if (message !== 'Permission denied' && !message.includes('aborted')) {
        setError(message)
      }
      console.error('Screenshot capture error:', err)
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const clear = useCallback(() => {
    setScreenshot(null)
    setError(null)
  }, [])

  return {
    screenshot,
    isCapturing,
    error,
    capture,
    clear,
  }
}
