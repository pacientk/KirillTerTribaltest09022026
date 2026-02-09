export interface Attachment {
  id: string
  name: string
  type: 'image' | 'code'
  mimeType: string
  url: string
  content?: string
}

export interface FileUploadResult {
  file: File
  preview: string
  type: 'image' | 'code'
}

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml']
export const ALLOWED_CODE_EXTENSIONS = ['.tsx', '.ts', '.json', '.css']
