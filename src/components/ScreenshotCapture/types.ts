import { FileUploadResult } from '../../types'

export interface ScreenshotCaptureProps {
  onCapture: (screenshot: FileUploadResult) => void
  disabled?: boolean
  className?: string
}
