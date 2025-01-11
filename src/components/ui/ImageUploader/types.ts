import { ChangeEvent } from 'react'

export interface ImageUploadProps {
  onSelectImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  onRemoveImage: () => void
  imagePreviewUrl: string | null
  acceptTypes?: string
}
