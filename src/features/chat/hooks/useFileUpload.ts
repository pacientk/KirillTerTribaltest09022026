import { useState, useCallback } from 'react'
import { FileUploadResult, ALLOWED_IMAGE_TYPES, ALLOWED_CODE_EXTENSIONS } from '../models'

function getFileType(file: File): 'image' | 'code' | null {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'image'
  }
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (ALLOWED_CODE_EXTENSIONS.includes(ext)) {
    return 'code'
  }
  return null
}

async function processFile(file: File): Promise<FileUploadResult | null> {
  const type = getFileType(file)
  if (!type) return null

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        file,
        preview: reader.result as string,
        type,
      })
    }
    if (type === 'image') {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  })
}

export interface UseFileUploadReturn {
  files: FileUploadResult[]
  error: string | null
  upload: (fileList: FileList | File[]) => Promise<void>
  remove: (index: number) => void
  clear: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileUploadResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (fileList: FileList | File[]) => {
    setError(null)
    const results: FileUploadResult[] = []
    const invalidFiles: string[] = []

    for (const file of Array.from(fileList)) {
      const result = await processFile(file)
      if (result) {
        results.push(result)
      } else {
        invalidFiles.push(file.name)
      }
    }

    if (invalidFiles.length > 0) {
      setError(`Unsupported files: ${invalidFiles.join(', ')}`)
    }

    if (results.length > 0) {
      setFiles((prev) => [...prev, ...results])
    }
  }, [])

  const remove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => {
    setFiles([])
    setError(null)
  }, [])

  return {
    files,
    error,
    upload,
    remove,
    clear,
  }
}
