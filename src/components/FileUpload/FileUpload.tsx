import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { FileUploadProps } from './types'
import { FileUploadResult, ALLOWED_IMAGE_TYPES, ALLOWED_CODE_EXTENSIONS } from '../../types'
import './styles.css'

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
    if (type === 'image') {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          file,
          preview: reader.result as string,
          type,
        })
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          file,
          preview: reader.result as string,
          type,
        })
      }
      reader.readAsText(file)
    }
  })
}

export function FileUpload({
  onUpload,
  disabled = false,
  className = '',
  multiple = true,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    const results: FileUploadResult[] = []
    const invalidFiles: string[] = []

    for (const file of Array.from(files)) {
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
      onUpload(results)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const acceptTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_CODE_EXTENSIONS.map((e) => e)].join(',')

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`drop-zone border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-2">
          <svg
            className={`w-10 h-10 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or
            drag and drop
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Images (PNG, JPG, SVG) or code files (.tsx, .ts, .json, .css)
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message mt-2 text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
