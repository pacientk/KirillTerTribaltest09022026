import { FileUploadResult } from '../../types'

export interface FileUploadProps {
  onUpload: (files: FileUploadResult[]) => void
  disabled?: boolean
  className?: string
  multiple?: boolean
}
